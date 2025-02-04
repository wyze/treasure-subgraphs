import { Address, BigInt, log, store } from "@graphprotocol/graph-ts";

import {
  ApprovalForAll,
  TransferBatch,
  TransferSingle,
} from "../../generated/Consumable/ERC1155";
import {
  Approval,
  ConsumableInfo,
  Token,
  User,
  UserApproval,
} from "../../generated/schema";
import { CONSUMABLE_IPFS, getAddressId, isMint } from "../helpers";
import * as common from "../mapping";

// @ts-ignore - i32 undefined
function getName(tokenId: i32): string {
  switch (tokenId) {
    case 1:
      return "Small Prism";
    case 2:
      return "Medium Prism";
    case 3:
      return "Large Prism";
    case 4:
      return "Small Extractor";
    case 5:
      return "Medium Extractor";
    case 6:
      return "Large Extractor";
    case 7:
      return "Harvester Part";
    case 8:
      return "Essence of Starlight";
    case 9:
      return "Prism Shards";
    case 10:
      return "Universal Lock";
    case 11:
      return "Azurite Dust";
    case 12:
      return "Essence of Honeycomb";
    case 13:
      return "Essence of Grin";
    case 14:
      return "Shrouded Tesseract";
    default:
      log.error("Unhandled consumable name: {}", [tokenId.toString()]);

      return "";
  }
}

const getDescription = (tokenId: i32): string | null => {
  switch (tokenId) {
    case 7:
      return "Please confirm that there are available Harvesters before buying a Harvester Part";
    default:
      return null;
  }
};

// @ts-ignore - i32 undefined
function getSize(tokenId: i32): string {
  switch (tokenId) {
    case 1:
    case 4:
      return "Small";
    case 2:
    case 5:
      return "Medium";
    case 3:
    case 6:
      return "Large";
    default:
      return "";
  }
}

// @ts-ignore - i32 undefined
function getType(tokenId: i32): string {
  switch (tokenId) {
    case 1:
    case 2:
    case 3:
      return "Prism";
    case 4:
    case 5:
    case 6:
      return "Extractor";
    case 7:
      return "Harvester Part";
    case 8:
    case 12:
    case 13:
      return "Essence";
    case 9:
      return "Shards";
    case 10:
      return "Lock";
    case 11:
      return "Dust";
    case 14:
      return "Tesseract";
    default:
      log.error("Unhandled consumable type: {}", [tokenId.toString()]);
      return "";
  }
}

function setMetadata(contract: Address, tokenId: BigInt): void {
  const token = Token.load(getAddressId(contract, tokenId));

  if (!token) {
    log.error("Unknown consumable token: {}", [tokenId.toString()]);
    return;
  }

  const tokenIdNum = tokenId.toI32();
  const metadata = new ConsumableInfo(`${token.id}-metadata`);
  const size = getSize(tokenIdNum);
  if (size !== "") {
    metadata.size = size;
  }
  metadata.type = getType(tokenIdNum);
  metadata.save();

  token.category = "Consumable";
  token.name = getName(tokenIdNum);
  token.description = getDescription(tokenIdNum);
  token.image = `${CONSUMABLE_IPFS}/${tokenIdNum}.jpg`;
  token.metadata = metadata.id;
  token.rarity = "None";
  token.save();
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  let params = event.params;

  let userId = params.account.toHexString();
  let user = User.load(userId);

  if (!user) {
    log.error("Unknown user: {}", [userId]);

    return;
  }

  let contract = event.address;
  let operator = params.operator;

  let approvalId = `${contract.toHexString()}-${operator.toHexString()}`;
  let approval = Approval.load(approvalId);

  if (!approval) {
    approval = new Approval(approvalId);

    approval.contract = contract;
    approval.operator = operator;

    approval.save();
  }

  let userApprovalId = `${user.id}-${approval.id}`;

  if (params.approved) {
    let userApproval = new UserApproval(userApprovalId);

    userApproval.approval = approval.id;
    userApproval.user = user.id;

    userApproval.save();
  } else {
    store.remove("UserApproval", userApprovalId);
  }
}

export function handleTransferBatch(event: TransferBatch): void {
  let params = event.params;

  for (let index = 0; index < params.ids.length; index++) {
    let id = params.ids[index];
    let value = params.values[index];

    common.handleTransfer(event.address, params.from, params.to, id, value);

    if (isMint(params.from)) {
      setMetadata(event.address, id);
    }
  }
}

export function handleTransferSingle(event: TransferSingle): void {
  let params = event.params;

  common.handleTransfer(
    event.address,
    params.from,
    params.to,
    params.id,
    params.value
  );

  if (isMint(params.from)) {
    setMetadata(event.address, params.id);
  }
}
