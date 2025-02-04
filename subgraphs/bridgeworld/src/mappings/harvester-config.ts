import { Address, BigInt, log } from "@graphprotocol/graph-ts";

import {
  CONSUMABLE_ADDRESS,
  LEGION_ADDRESS,
  TREASURE_ADDRESS,
} from "@treasure/constants";

import {
  Harvester,
  HarvesterStakingRule,
  HarvesterTimelock,
  Token,
} from "../../generated/schema";
import {
  ExtractorsStakingRules,
  ExtractorsStakingRulesConfig,
  LegionsStakingRules,
  PartsStakingRules,
  TreasuresStakingRules,
} from "../../generated/templates";
import {
  ExtractorBoost,
  ExtractorsStakingRules as ExtractorsStakingRulesContract,
  Lifetime,
  MaxStakeable,
} from "../../generated/templates/ExtractorsStakingRulesConfig/ExtractorsStakingRules";
import {
  DepositCapPerWallet,
  TimelockOption,
  TimelockOptionDisabled,
  TimelockOptionEnabled,
  TotalDepositCap,
} from "../../generated/templates/HarvesterConfig/Harvester";
import {
  LegionsStakingRules as LegionsStakingRulesContract,
  MaxWeight,
} from "../../generated/templates/LegionsStakingRules/LegionsStakingRules";
import { NftConfigSet } from "../../generated/templates/NftHandler/NftHandler";
import {
  BoostFactor,
  MaxStakeablePerUser,
  MaxStakeableTotal,
  PartsStakingRules as PartsStakingRulesContract,
} from "../../generated/templates/PartsStakingRules/PartsStakingRules";
import { TreasuresStakingRules as TreasuresStakingRulesContract } from "../../generated/templates/TreasuresStakingRules/TreasuresStakingRules";
import {
  HARVESTER_EXTRACTOR_TOKEN_IDS,
  HARVESTER_PART_TOKEN_ID,
  getAddressId,
} from "../helpers";
import {
  createOrUpdateHarvesterTokenBoost,
  getHarvester,
  getHarvesterForNftHandler,
  getHarvesterForStakingRule,
} from "../helpers/harvester";

export function handleUpdatedMagicTotalDepositCap(
  event: TotalDepositCap
): void {
  const harvester = getHarvester(event.address);
  if (!harvester) {
    return;
  }

  harvester.maxMagicDeposited = event.params.totalDepositCap;
  harvester.save();
}

export function handleUpdatedPartsDepositCap(event: DepositCapPerWallet): void {
  const harvester = getHarvester(event.address);
  if (!harvester) {
    return;
  }

  harvester.magicDepositAllocationPerPart =
    event.params.depositCapPerWallet.capPerPart;
  harvester.save();
}

export function handleAddedTimelockOption(event: TimelockOption): void {
  const harvesterId = event.address.toHexString();
  const params = event.params;
  const timelock = new HarvesterTimelock(
    `${harvesterId}-${params.id.toHexString()}`
  );
  timelock.harvester = harvesterId;
  timelock.enabled = params.timelock.enabled;
  timelock.timelockId = params.id;
  timelock.boost = params.timelock.boost;
  timelock.duration = params.timelock.timelock;
  timelock.vestingDuration = params.timelock.vesting;
  timelock.save();
}

export function handleEnabledTimelockOption(
  event: TimelockOptionEnabled
): void {
  const harvesterId = event.address.toHexString();
  const params = event.params;
  const timelock = HarvesterTimelock.load(
    `${harvesterId}-${params.id.toHexString()}`
  );
  if (!timelock) {
    log.error("Unknown timelock option: {}", [params.id.toString()]);
    return;
  }

  timelock.enabled = true;
  timelock.save();
}

export function handleDisabledTimelockOption(
  event: TimelockOptionDisabled
): void {
  const harvesterId = event.address.toHexString();
  const params = event.params;
  const timelock = HarvesterTimelock.load(
    `${harvesterId}-${params.id.toHexString()}`
  );
  if (!timelock) {
    log.error("Unknown timelock option: {}", [params.id.toString()]);
    return;
  }

  timelock.enabled = false;
  timelock.save();
}

export function handleNftConfigSet(event: NftConfigSet): void {
  // Load associated Harvester
  const harvester = getHarvesterForNftHandler(event.address);
  if (!harvester) {
    return;
  }

  const params = event.params;

  // Create StakingRule entity
  const stakingRulesAddress = params._nftConfig.stakingRules;
  const stakingRule = new HarvesterStakingRule(
    stakingRulesAddress.toHexString()
  );
  stakingRule.harvester = harvester.id;
  stakingRule.save();

  const nftAddress = params._nft;
  const tokenId = params._tokenId;

  // Determine the type of StakingRule and start listening for events at this address
  // Pull initial rules from the contract because we weren't listening for init events
  if (nftAddress.equals(CONSUMABLE_ADDRESS)) {
    // Check Consumable token ID
    if (tokenId.equals(HARVESTER_PART_TOKEN_ID)) {
      PartsStakingRules.create(stakingRulesAddress);
      processPartsStakingRules(stakingRulesAddress, harvester);
    } else if (HARVESTER_EXTRACTOR_TOKEN_IDS.includes(tokenId)) {
      ExtractorsStakingRulesConfig.create(stakingRulesAddress);
      ExtractorsStakingRules.create(stakingRulesAddress);
      processExtractorsStakingRules(stakingRulesAddress, harvester);
    }
  } else if (nftAddress.equals(LEGION_ADDRESS)) {
    LegionsStakingRules.create(stakingRulesAddress);
    processLegionsStakingRules(stakingRulesAddress, harvester);
  } else if (nftAddress.equals(TREASURE_ADDRESS)) {
    TreasuresStakingRules.create(stakingRulesAddress);
    processTreasuresStakingRules(stakingRulesAddress, harvester);
  }
}

const processPartsStakingRules = (
  address: Address,
  harvester: Harvester
): void => {
  const contract = PartsStakingRulesContract.bind(address);

  let result = contract.try_boostFactor();
  if (!result.reverted) {
    harvester.partsBoostFactor = result.value;
  } else {
    log.error("Error fetching Parts boost factor: {}", [address.toHexString()]);
  }

  result = contract.try_maxStakeablePerUser();
  if (!result.reverted) {
    harvester.maxPartsStakedPerUser = result.value.toI32();
  } else {
    log.error("Error fetching Parts max stakeable per user: {}", [
      address.toHexString(),
    ]);
  }

  result = contract.try_maxStakeableTotal();
  if (!result.reverted) {
    harvester.maxPartsStaked = result.value.toI32();
  } else {
    log.error("Error fetching Parts max stakeable: {}", [
      address.toHexString(),
    ]);
  }

  harvester.save();
};

const processExtractorsStakingRules = (
  address: Address,
  harvester: Harvester
): void => {
  const contract = ExtractorsStakingRulesContract.bind(address);

  let result = contract.try_lifetime();
  if (!result.reverted) {
    harvester.extractorsLifetime = result.value;
  } else {
    log.error("Error fetching Extractors lifetime: {}", [
      address.toHexString(),
    ]);
  }

  result = contract.try_maxStakeable();
  if (!result.reverted) {
    harvester.maxExtractorsStaked = result.value.toI32();
  } else {
    log.error("Error fetching Extractors max stakeable: {}", [
      address.toHexString(),
    ]);
  }

  for (let i = 4; i <= 6; i++) {
    const token = Token.load(
      getAddressId(CONSUMABLE_ADDRESS, BigInt.fromI32(i))
    );
    if (!token) {
      log.error("Error fetching Extractor token: {}", [i.toString()]);
      continue;
    }

    result = contract.try_extractorBoost(BigInt.fromI32(i));
    if (!result.reverted) {
      createOrUpdateHarvesterTokenBoost(harvester, token, result.value);
    } else {
      log.error("Error fetching Extractor boost: {}, {}", [
        i.toString(),
        address.toHexString(),
      ]);
    }
  }

  harvester.save();
};

const processLegionsStakingRules = (
  address: Address,
  harvester: Harvester
): void => {
  const contract = LegionsStakingRulesContract.bind(address);

  let result = contract.try_maxStakeableTotal();
  if (!result.reverted) {
    harvester.maxLegionsStaked = result.value.toI32();
  } else {
    log.error("Error fetching Legions max stakeable: {}", [
      address.toHexString(),
    ]);
  }

  result = contract.try_maxLegionWeight();
  if (!result.reverted) {
    harvester.maxLegionsWeightPerUser = result.value;
  } else {
    log.error("Error fetching Legions max weight: {}", [address.toHexString()]);
  }

  harvester.save();
};

const processTreasuresStakingRules = (
  address: Address,
  harvester: Harvester
): void => {
  const contract = TreasuresStakingRulesContract.bind(address);

  let result = contract.try_maxStakeablePerUser();
  if (!result.reverted) {
    harvester.maxTreasuresStakedPerUser = result.value.toI32();
  } else {
    log.error("Error fetching Treasures max stakeable: {}", [
      address.toHexString(),
    ]);
  }

  harvester.save();
};

export function handleUpdatedPartsBoostFactor(event: BoostFactor): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.partsBoostFactor = event.params.boostFactor;
  harvester.save();
}

export function handleUpdatedPartsMaxStakeablePerUser(
  event: MaxStakeablePerUser
): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.maxPartsStakedPerUser = event.params.maxStakeablePerUser.toI32();
  harvester.save();
}

export function handleUpdatedPartsStakeableTotal(
  event: MaxStakeableTotal
): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.maxPartsStaked = event.params.maxStakeableTotal.toI32();
  harvester.save();
}

export function handleUpdatedExtractorsLifetime(event: Lifetime): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.extractorsLifetime = event.params.lifetime;
  harvester.save();
}

export function handleUpdatedExtractorsMaxStakeable(event: MaxStakeable): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.maxExtractorsStaked = event.params.maxStakeable.toI32();
  harvester.save();
}

export function handleUpdatedExtractorsBoost(event: ExtractorBoost): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  const params = event.params;

  const token = Token.load(getAddressId(CONSUMABLE_ADDRESS, params.tokenId));
  if (!token) {
    log.error("Error fetching Extractor token: {}", [
      params.tokenId.toString(),
    ]);
    return;
  }

  createOrUpdateHarvesterTokenBoost(harvester, token, params.boost);

  // TODO: Re-calculate Harvester extractors boost?
}

export function handleUpdatedLegionsMaxStakeableTotal(
  event: MaxStakeableTotal
): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.maxLegionsStaked = event.params.maxStakeableTotal.toI32();
  harvester.save();
}

export function handleUpdatedLegionsMaxWeight(event: MaxWeight): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.maxLegionsWeightPerUser = event.params.maxLegionWeight;
  harvester.save();
}

export function handleUpdatedTreasuresMaxStakeablePerUser(
  event: MaxStakeablePerUser
): void {
  const harvester = getHarvesterForStakingRule(event.address);
  if (!harvester) {
    return;
  }

  harvester.maxTreasuresStakedPerUser =
    event.params.maxStakeablePerUser.toI32();
  harvester.save();
}
