import {
  Address,
  BigInt,
  Bytes,
  JSONValueKind,
  ethereum,
  json,
  log,
} from "@graphprotocol/graph-ts";

import { BURNER_ADDRESS } from "@treasure/constants";

import {
  ERC1155,
  TransferBatch,
  TransferSingle,
} from "../generated/Treasure Fraction/ERC1155";
import { Transfer as TransferEvent } from "../generated/Treasure/ERC721";
import { L1Treasure } from "../generated/Treasure/L1Treasure";
import { TokenTransfer, User } from "../generated/schema";
import { decode } from "./helpers/base64";
import { getTokenIdByTreasureName } from "./helpers/token-id";

const getOrCreateUser = (address: Address): User => {
  const id = address.toHexString();
  let user = User.load(id);
  if (!user) {
    user = new User(id);
    user.save();
  }

  return user;
};

const createOrUpdatedTransfer = (
  event: ethereum.Event,
  userAddress: Address,
  tokenId: BigInt,
  quantity: BigInt
): void => {
  const user = getOrCreateUser(userAddress);
  const id = `${event.transaction.hash.toHexString()}-${tokenId.toString()}`;
  let transfer = TokenTransfer.load(id);
  if (!transfer) {
    transfer = new TokenTransfer(id);
    transfer.blockNumber = event.block.number;
    transfer.user = user.id;
    transfer.tokenId = tokenId;
    transfer.quantity = 0;
  }

  transfer.quantity += quantity.toI32();
  transfer.save();
};

const getTokenIdForFraction = (
  address: Address,
  tokenId: BigInt
): BigInt | null => {
  const contract = ERC1155.bind(address);
  const uri = Bytes.fromUint8Array(
    decode(contract.uri(tokenId).replace("data:application/json;base64,", ""))
  );
  const data = json.fromBytes(uri);
  if (data.kind == JSONValueKind.OBJECT) {
    const name = data.toObject().get("name");
    if (name != null) {
      return getTokenIdByTreasureName(name.toString());
    }
  }

  log.warning("Mapped token ID for fraction not found: {}", [
    tokenId.toString(),
  ]);
  return null;
};

export function handleTransfer721(event: TransferEvent): void {
  const params = event.params;

  // Only handle transfers sent to the burn address
  if (params.to.notEqual(BURNER_ADDRESS)) {
    return;
  }

  // Fetch token names for all assets in this loot token
  const tokenId = params.tokenId;
  const contract = L1Treasure.bind(event.address);
  const assets: string[] = [
    contract.getAsset1(tokenId),
    contract.getAsset2(tokenId),
    contract.getAsset3(tokenId),
    contract.getAsset4(tokenId),
    contract.getAsset5(tokenId),
    contract.getAsset6(tokenId),
    contract.getAsset7(tokenId),
    contract.getAsset8(tokenId),
  ];

  for (let index = 0; index < assets.length; index++) {
    createOrUpdatedTransfer(
      event,
      params.from,
      getTokenIdByTreasureName(assets[index]),
      BigInt.fromI32(1)
    );
  }
}

export function handleTransferSingle(event: TransferSingle): void {
  const params = event.params;

  // Only handle transfers sent to the burn address
  if (params.to.notEqual(BURNER_ADDRESS)) {
    return;
  }

  // Fetch token name for asset in this fraction token
  const tokenId = getTokenIdForFraction(event.address, params.id);
  if (tokenId) {
    createOrUpdatedTransfer(event, params.from, tokenId, BigInt.fromI32(1));
  }
}

export function handleTransferBatch(event: TransferBatch): void {
  const params = event.params;

  // Only handle transfers sent to the burn address
  if (params.to.notEqual(BURNER_ADDRESS)) {
    return;
  }

  const ids = params.ids;
  const quantities = params.values;
  for (let index = 0; index < ids.length; index++) {
    // Fetch token name for asset in this fraction token
    const tokenId = getTokenIdForFraction(event.address, ids[index]);
    if (tokenId) {
      createOrUpdatedTransfer(event, params.from, tokenId, quantities[index]);
    }
  }
}
