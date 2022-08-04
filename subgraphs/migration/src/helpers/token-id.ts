import { BigInt } from "@graphprotocol/graph-ts";

const TREASURE_IDS: i32[] = [
  39, 46, 47, 48, 49, 51, 52, 53, 54, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79,
  82, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 103, 104, 105, 114, 115, 116,
  117, 132, 133, 141, 151, 152, 153, 161, 162, 164,
];

const TREASURE_NAMES: string[] = [
  "Ancient Relic",
  "Bag of Rare Mushrooms",
  "Bait for Monsters",
  "Beetle Wings",
  "Blue Rupee",
  "Bottomless Elixir",
  "Cap of Invisibility",
  "Carriage",
  "Castle",
  "Common Bead",
  "Common Feather",
  "Common Relic",
  "Cow",
  "Diamond",
  "Divine Hourglass",
  "Divine Mask",
  "Donkey",
  "Dragon Tail",
  "Emerald",
  "Favor from the Gods",
  "Framed Butterfly",
  "Gold Coin",
  "Grain",
  "Green Rupee",
  "Grin",
  "Half-Penny",
  "Honeycomb",
  "Immovable Stone",
  "Ivory Breastpin",
  "Jar of Fairies",
  "Lumber",
  "Military Stipend",
  "Mollusk Shell",
  "Ox",
  "Pearl",
  "Pot of Gold",
  "Quarter-Penny",
  "Red Feather",
  "Red Rupee",
  "Score of Ivory",
  "Silver Coin",
  "Small Bird",
  "Snow White Feather",
  "Thread of Divine Silk",
  "Unbreakable Pocketwatch",
  "Witches Broom",
];

export const getTokenIdByTreasureName = (name: string): BigInt => {
  const normalizedName = name
    .replace("Carrage", "Carriage")
    .replace("Silver Penny", "Silver Coin")
    .replace("Red FeatherSnow White Feather", "Snow White Feather")
    .replace("Red and White Feather", "Snow White Feather")
    .replace("Beetle-wing", "Beetle Wings");
  const index = TREASURE_NAMES.indexOf(normalizedName);
  if (index === -1) {
    throw new Error(`Unhandled Treasure name: ${normalizedName}`);
  }

  return BigInt.fromI32(TREASURE_IDS[index]);
};
