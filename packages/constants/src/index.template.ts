import { Address, BigInt } from "@graphprotocol/graph-ts";

export const BURNER_ADDRESS = Address.fromString(
  "{{burner_address}}{{^burner_address}}0x0000000000000000000000000000000000000000{{/burner_address}}"
);

export const TROVE_MAGIC_ADDRESS = Address.fromString(
  "{{trove_magic_address}}{{^trove_magic_address}}0x0000000000000000000000000000000000000000{{/trove_magic_address}}"
);
export const BALANCER_CRYSTAL_ADDRESS = Address.fromString(
  "{{balancer_crystal_address}}{{^balancer_crystal_address}}0x0000000000000000000000000000000000000000{{/balancer_crystal_address}}"
);
export const CONSUMABLE_ADDRESS = Address.fromString(
  "{{consumable_address}}{{^consumable_address}}0x0000000000000000000000000000000000000000{{/consumable_address}}"
);
export const CRAFTING_ADDRESS = Address.fromString(
  "{{crafting_address}}{{^crafting_address}}0x0000000000000000000000000000000000000000{{/crafting_address}}"
);
export const EXPLORER = "{{explorer}}";
export const LEGION_ADDRESS = Address.fromString(
  "{{legion_address}}{{^legion_address}}0x0000000000000000000000000000000000000000{{/legion_address}}"
);
export const QUESTING_ADDRESS = Address.fromString(
  "{{questing_address}}{{^questing_address}}0x0000000000000000000000000000000000000000{{/questing_address}}"
);
export const ADVANCED_QUESTING_ADDRESS = Address.fromString(
  "{{advanced_questing_address}}{{^advanced_questing_address}}0x0000000000000000000000000000000000000000{{/advanced_questing_address}}"
);
export const TREASURE_TRIAD_ADDRESS = Address.fromString(
  "{{treasure_triad_address}}{{^treasure_triad_address}}0x0000000000000000000000000000000000000000{{/treasure_triad_address}}"
);
export const SUMMONING_ADDRESS = Address.fromString(
  "{{summoning_address}}{{^summoning_address}}0x0000000000000000000000000000000000000000{{/summoning_address}}"
);
export const TREASURE_ADDRESS = Address.fromString(
  "{{treasure_address}}{{^treasure_address}}0x0000000000000000000000000000000000000000{{/treasure_address}}"
);
export const TREASURE_FRAGMENT_ADDRESS = Address.fromString(
  "{{treasure_fragment_address}}{{^treasure_fragment_address}}0x0000000000000000000000000000000000000000{{/treasure_fragment_address}}"
);
export const SMOL_BODIES_ADDRESS = Address.fromString(
  "{{smol_bodies_address}}{{^smol_bodies_address}}0x0000000000000000000000000000000000000000{{/smol_bodies_address}}"
);
export const SMOL_BODIES_PETS_ADDRESS = Address.fromString(
  "{{smol_bodies_pets_address}}{{^smol_bodies_pets_address}}0x0000000000000000000000000000000000000000{{/smol_bodies_pets_address}}"
);
export const SMOL_BRAINS_ADDRESS = Address.fromString(
  "{{smol_brains_address}}{{^smol_brains_address}}0x0000000000000000000000000000000000000000{{/smol_brains_address}}"
);
export const SMOL_BRAINS_LAND_ADDRESS = Address.fromString(
  "{{smol_brains_land_address}}{{^smol_brains_land_address}}0x0000000000000000000000000000000000000000{{/smol_brains_land_address}}"
);
export const SMOL_BRAINS_PETS_ADDRESS = Address.fromString(
  "{{smol_brains_pets_address}}{{^smol_brains_pets_address}}0x0000000000000000000000000000000000000000{{/smol_brains_pets_address}}"
);
export const SMOL_FARM_ADDRESS = Address.fromString(
  "{{smol_farm_address}}{{^smol_farm_address}}0x0000000000000000000000000000000000000000{{/smol_farm_address}}"
);
export const SMOL_TREASURES_ADDRESS = Address.fromString(
  "{{smol_treasures_address}}{{^smol_treasures_address}}0x0000000000000000000000000000000000000000{{/smol_treasures_address}}"
);
export const MARKETPLACE_ADDRESS = Address.fromString(
  "{{treasure_marketplace_address}}{{^treasure_marketplace_address}}0x0000000000000000000000000000000000000000{{/treasure_marketplace_address}}"
);
export const MARKETPLACE_V2_ADDRESS = Address.fromString(
  "{{treasure_marketplace_v2_address}}{{^treasure_marketplace_v2_address}}0x0000000000000000000000000000000000000000{{/treasure_marketplace_v2_address}}"
);
export const MARKETPLACE_BUYER_ADDRESS = Address.fromString(
  "{{treasure_marketplace_buyer_address}}{{^treasure_marketplace_buyer_address}}0x0000000000000000000000000000000000000000{{/treasure_marketplace_buyer_address}}"
);
export const SEED_OF_LIFE_ADDRESS = Address.fromString(
  "{{seed_of_life_address}}{{^seed_of_life_address}}0x0000000000000000000000000000000000000000{{/seed_of_life_address}}"
);
export const SEED_OF_LIFE_RESOURCES_ADDRESS = Address.fromString(
  "{{sol_resources_address}}{{^sol_resources_address}}0x0000000000000000000000000000000000000000{{/sol_resources_address}}"
);
export const SEED_EVOLUTION_ADDRESS = Address.fromString(
  "{{seed_evolution_address}}{{^seed_evolution_address}}0x0000000000000000000000000000000000000000{{/seed_evolution_address}}"
);
export const IMBUED_SOULS_ADDRESS = Address.fromString(
  "{{imbued_souls_address}}{{^imbued_souls_address}}0x0000000000000000000000000000000000000000{{/imbued_souls_address}}"
);
export const SEED_OF_LIFE_TREASURES_ADDRESS = Address.fromString(
  "{{seed_of_life_treasures_address}}{{^seed_of_life_treasures_address}}0x0000000000000000000000000000000000000000{{/seed_of_life_treasures_address}}"
);

export const HOURLY_STAT_INTERVAL_START_BLOCK = BigInt.fromString(
  "{{hourly_stat_interval_start_block}}{{^hourly_stat_interval_start_block}}0{{/hourly_stat_interval_start_block}}"
);
export const EXTRA_LIFE_ADDRESS = Address.fromString(
  "{{extra_life_address}}{{^extra_life_address}}0x0000000000000000000000000000000000000000{{/extra_life_address}}"
);
export const KEYS_ADDRESS = Address.fromString(
  "{{keys_address}}{{^keys_address}}0x0000000000000000000000000000000000000000{{/keys_address}}"
);
export const SMOL_CARS_ADDRESS = Address.fromString(
  "{{smol_cars_address}}{{^smol_cars_address}}0x0000000000000000000000000000000000000000{{/smol_cars_address}}"
);
export const SWOLERCYCLES_ADDRESS = Address.fromString(
  "{{swolercycles_address}}{{^swolercycles_address}}0x0000000000000000000000000000000000000000{{/swolercycles_address}}"
);
export const BATTLEFLY_ADDRESS = Address.fromString(
  "{{battlefly_address}}{{^battlefly_address}}0x0000000000000000000000000000000000000000{{/battlefly_address}}"
);
export const BATTLEFLY_FOUNDERS_ADDRESS = Address.fromString(
  "{{battlefly_founders_address}}{{^battlefly_founders_address}}0x0000000000000000000000000000000000000000{{/battlefly_founders_address}}"
);
export const LEGACY_LEGION_ADDRESS = Address.fromString(
  "{{legacy_legion_address}}{{^legacy_legion_address}}0x0000000000000000000000000000000000000000{{/legacy_legion_address}}"
);
export const LEGACY_LEGION_GENESIS_ADDRESS = Address.fromString(
  "{{legacy_legion_genesis_address}}{{^legacy_legion_genesis_address}}0x0000000000000000000000000000000000000000{{/legacy_legion_genesis_address}}"
);
export const TREASURE_MARKETPLACE_PAUSE_START_BLOCK = BigInt.fromString(
  "{{treasure_marketplace_pause_start_block}}{{^treasure_marketplace_pause_start_block}}0{{/treasure_marketplace_pause_start_block}}"
);
export const TALES_OF_ELLERIA_ADDRESS = Address.fromString(
  "{{tales_of_elleria_address}}{{^tales_of_elleria_address}}0x0000000000000000000000000000000000000000{{/tales_of_elleria_address}}"
);
export const TALES_OF_ELLERIA_DATA_ADDRESS = Address.fromString(
  "{{tales_of_elleria_data_address}}{{^tales_of_elleria_data_address}}0x0000000000000000000000000000000000000000{{/tales_of_elleria_data_address}}"
);
export const TOADSTOOLZ_ADDRESS = Address.fromString(
  "{{toadstoolz_address}}{{^toadstoolz_address}}0x0000000000000000000000000000000000000000{{/toadstoolz_address}}"
);
export const TOADSTOOLZ_ITEMZ_ADDRESS = Address.fromString(
  "{{toadstoolz_itemz_address}}{{^toadstoolz_itemz_address}}0x0000000000000000000000000000000000000000{{/toadstoolz_itemz_address}}"
);
export const KOTE_QUESTING_ADDRESS = Address.fromString(
  "{{kote_questing_address}}{{^kote_questing_address}}0x0000000000000000000000000000000000000000{{/kote_questing_address}}"
);
export const WRAPPED_SMOLS_ADDRESS = Address.fromString(
  "{{wrapped_smols_address}}{{^wrapped_smols_address}}0x0000000000000000000000000000000000000000{{/wrapped_smols_address}}"
);
