import { assert, clearStore, test } from "matchstick-as/assembly";

import { Address, BigInt } from "@graphprotocol/graph-ts";

import { LEGION_ADDRESS } from "@treasure/constants";

import { setQuestingXpGainedBlockNumberIfEmpty } from "../src/helpers/config";
import {
  handleLegionCreated,
  handleLegionQuestLevelUp,
  handleTransfer,
} from "../src/mappings/legion";
import {
  handleQuestFinished,
  handleQuestRevealed,
  handleQuestStartedWithDifficulty,
  handleQuestStartedWithoutDifficulty,
  handleQuestXpGained,
} from "../src/mappings/questing";
import {
  handleRandomRequest,
  handleRandomSeeded,
} from "../src/mappings/randomizer";
import {
  Difficulty,
  LEGION_INFO_ENTITY_TYPE,
  QUESTING_ADDRESS,
  QUEST_ENTITY_TYPE,
  USER_ADDRESS,
} from "./helpers/constants";
import {
  createLegionCreatedEvent,
  createLegionQuestLevelUpEvent,
  createLegionTransferEvent,
} from "./helpers/legion";
import {
  createQuestFinishedEvent,
  createQuestRevealedEvent,
  createQuestStartedEvent,
  createQuestStartedWithoutDifficultyEvent,
  createQuestXpGainedEvent,
} from "./helpers/questing";
import {
  createRandomRequestEvent,
  createRandomSeededEvent,
} from "./helpers/randomizer";

test("questing increases xp when completed", () => {
  clearStore();

  const mintEvent = createLegionTransferEvent(
    Address.zero().toHexString(),
    USER_ADDRESS,
    1
  );

  handleTransfer(mintEvent);

  const legionCreatedEvent = createLegionCreatedEvent(USER_ADDRESS, 1, 0, 6, 2);

  handleLegionCreated(legionCreatedEvent);

  const id = `${LEGION_ADDRESS.toHexString()}-0x1`;
  const metadata = `${id}-metadata`;

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "1");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questsCompleted", "0");
  assert.fieldEquals(
    LEGION_INFO_ENTITY_TYPE,
    metadata,
    "questsDistanceTravelled",
    "0"
  );

  let questsToLevelUp = 10;

  // Lets do 10 quests, then level up to level 2
  for (let index = 1; index < questsToLevelUp + 1; index++) {
    const randomRequestEvent = createRandomRequestEvent(index, index + 1);

    handleRandomRequest(randomRequestEvent);

    const questStartedEvent = createQuestStartedWithoutDifficultyEvent(
      USER_ADDRESS,
      1,
      index
    );

    handleQuestStartedWithoutDifficulty(questStartedEvent);

    const randomSeededEvent = createRandomSeededEvent(index + 1);

    handleRandomSeeded(randomSeededEvent);

    const questRevealedEvent = createQuestRevealedEvent(USER_ADDRESS, 1);

    handleQuestRevealed(questRevealedEvent);

    if (index === questsToLevelUp) {
      // Level up on reveal
      const questLevelUpEvent = createLegionQuestLevelUpEvent(1, 2);

      handleLegionQuestLevelUp(questLevelUpEvent);

      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "2");
      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
    } else {
      assert.fieldEquals(
        LEGION_INFO_ENTITY_TYPE,
        metadata,
        "questingXp",
        `${10 * index}`
      );
    }

    const questFinishedEvent = createQuestFinishedEvent(USER_ADDRESS, 1);

    handleQuestFinished(questFinishedEvent);
  }

  assert.fieldEquals(
    LEGION_INFO_ENTITY_TYPE,
    metadata,
    "questsCompleted",
    questsToLevelUp.toString()
  );
  assert.fieldEquals(
    LEGION_INFO_ENTITY_TYPE,
    metadata,
    "questsDistanceTravelled",
    (questsToLevelUp * 10).toString()
  );

  questsToLevelUp = 20;

  // Lets do 20 quests, then level up to level 3
  for (let index = 1; index < questsToLevelUp + 1; index++) {
    const randomRequestEvent = createRandomRequestEvent(index, index + 1);

    handleRandomRequest(randomRequestEvent);

    const questStartedEvent = createQuestStartedWithoutDifficultyEvent(
      USER_ADDRESS,
      1,
      index
    );

    handleQuestStartedWithoutDifficulty(questStartedEvent);

    const randomSeededEvent = createRandomSeededEvent(index + 1);

    handleRandomSeeded(randomSeededEvent);

    const questRevealedEvent = createQuestRevealedEvent(USER_ADDRESS, 1);

    handleQuestRevealed(questRevealedEvent);

    if (index === questsToLevelUp) {
      // Level up on reveal
      const questLevelUpEvent = createLegionQuestLevelUpEvent(1, 3);

      handleLegionQuestLevelUp(questLevelUpEvent);

      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "3");
      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
    } else {
      assert.fieldEquals(
        LEGION_INFO_ENTITY_TYPE,
        metadata,
        "questingXp",
        `${10 * index}`
      );
    }

    const questFinishedEvent = createQuestFinishedEvent(USER_ADDRESS, 1);

    handleQuestFinished(questFinishedEvent);
  }

  questsToLevelUp = 25;

  // Lets do 25 quests, then level up to level 4
  for (let index = 1; index < questsToLevelUp + 1; index++) {
    const randomRequestEvent = createRandomRequestEvent(index, index + 1);

    handleRandomRequest(randomRequestEvent);

    const questStartedEvent = createQuestStartedWithoutDifficultyEvent(
      USER_ADDRESS,
      1,
      index
    );

    handleQuestStartedWithoutDifficulty(questStartedEvent);

    const randomSeededEvent = createRandomSeededEvent(index + 1);

    handleRandomSeeded(randomSeededEvent);

    const questRevealedEvent = createQuestRevealedEvent(USER_ADDRESS, 1);

    handleQuestRevealed(questRevealedEvent);

    if (index === questsToLevelUp) {
      // Level up on reveal
      const questLevelUpEvent = createLegionQuestLevelUpEvent(1, 4);

      handleLegionQuestLevelUp(questLevelUpEvent);

      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "4");
      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
    } else {
      assert.fieldEquals(
        LEGION_INFO_ENTITY_TYPE,
        metadata,
        "questingXp",
        `${20 * index}`
      );
    }

    const questFinishedEvent = createQuestFinishedEvent(USER_ADDRESS, 1);

    handleQuestFinished(questFinishedEvent);
  }

  questsToLevelUp = 50;

  // Lets do 50 quests, then level up to level 5
  for (let index = 1; index < questsToLevelUp + 1; index++) {
    const randomRequestEvent = createRandomRequestEvent(index, index + 1);

    handleRandomRequest(randomRequestEvent);

    const questStartedEvent = createQuestStartedWithoutDifficultyEvent(
      USER_ADDRESS,
      1,
      index
    );

    handleQuestStartedWithoutDifficulty(questStartedEvent);

    const randomSeededEvent = createRandomSeededEvent(index + 1);

    handleRandomSeeded(randomSeededEvent);

    const questRevealedEvent = createQuestRevealedEvent(USER_ADDRESS, 1);

    handleQuestRevealed(questRevealedEvent);

    if (index === questsToLevelUp) {
      // Level up on reveal
      const questLevelUpEvent = createLegionQuestLevelUpEvent(1, 5);

      handleLegionQuestLevelUp(questLevelUpEvent);

      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "5");
      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
    } else {
      assert.fieldEquals(
        LEGION_INFO_ENTITY_TYPE,
        metadata,
        "questingXp",
        `${20 * index}`
      );
    }

    const questFinishedEvent = createQuestFinishedEvent(USER_ADDRESS, 1);

    handleQuestFinished(questFinishedEvent);
  }

  // Lets do 50 quests, then level up to level 6 (max)
  for (let index = 1; index < questsToLevelUp + 1; index++) {
    const randomRequestEvent = createRandomRequestEvent(index, index + 1);

    handleRandomRequest(randomRequestEvent);

    const questStartedEvent = createQuestStartedWithoutDifficultyEvent(
      USER_ADDRESS,
      1,
      index
    );

    handleQuestStartedWithoutDifficulty(questStartedEvent);

    const randomSeededEvent = createRandomSeededEvent(index + 1);

    handleRandomSeeded(randomSeededEvent);

    const questRevealedEvent = createQuestRevealedEvent(USER_ADDRESS, 1);

    handleQuestRevealed(questRevealedEvent);

    if (index === questsToLevelUp) {
      // Level up on reveal
      const questLevelUpEvent = createLegionQuestLevelUpEvent(1, 6);

      handleLegionQuestLevelUp(questLevelUpEvent);

      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "6");
      assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
    } else {
      assert.fieldEquals(
        LEGION_INFO_ENTITY_TYPE,
        metadata,
        "questingXp",
        `${40 * index}`
      );
    }

    const questFinishedEvent = createQuestFinishedEvent(USER_ADDRESS, 1);

    handleQuestFinished(questFinishedEvent);
  }
});

test("questing xp does not increase at max level (6)", () => {
  clearStore();

  const mintEvent = createLegionTransferEvent(
    Address.zero().toHexString(),
    USER_ADDRESS,
    1
  );

  handleTransfer(mintEvent);

  const legionCreatedEvent = createLegionCreatedEvent(USER_ADDRESS, 1, 0, 6, 2);

  handleLegionCreated(legionCreatedEvent);

  const id = `${LEGION_ADDRESS.toHexString()}-0x1`;
  const metadata = `${id}-metadata`;

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "1");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questsCompleted", "0");
  assert.fieldEquals(
    LEGION_INFO_ENTITY_TYPE,
    metadata,
    "questsDistanceTravelled",
    "0"
  );

  // Short cut to max level
  const questLevelUp = createLegionQuestLevelUpEvent(1, 6);

  handleLegionQuestLevelUp(questLevelUp);

  // Perform a craft
  const randomRequestEvent = createRandomRequestEvent(1, 2);

  handleRandomRequest(randomRequestEvent);

  const questStartedEvent = createQuestStartedWithoutDifficultyEvent(
    USER_ADDRESS,
    1,
    1
  );

  handleQuestStartedWithoutDifficulty(questStartedEvent);

  const questId = `${QUESTING_ADDRESS}-0x1`;

  assert.fieldEquals(QUEST_ENTITY_TYPE, questId, "difficulty", "Easy");

  const randomSeededEvent = createRandomSeededEvent(2);

  handleRandomSeeded(randomSeededEvent);

  const craftRevealedEvent = createQuestRevealedEvent(USER_ADDRESS, 1);

  handleQuestRevealed(craftRevealedEvent);

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");

  const questFinishedEvent = createQuestFinishedEvent(USER_ADDRESS, 1);

  handleQuestFinished(questFinishedEvent);

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questsCompleted", "1");
  assert.fieldEquals(
    LEGION_INFO_ENTITY_TYPE,
    metadata,
    "questsDistanceTravelled",
    "10"
  );
});

test("legacy questing xp does not increase after upgrade block", () => {
  clearStore();

  // Create Legion
  handleTransfer(
    createLegionTransferEvent(Address.zero().toHexString(), USER_ADDRESS, 1)
  );
  handleLegionCreated(createLegionCreatedEvent(USER_ADDRESS, 1, 0, 6, 2));

  const id = `${LEGION_ADDRESS.toHexString()}-0x1`;
  const metadata = `${id}-metadata`;

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "1");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");

  // Perform a quest
  handleRandomRequest(createRandomRequestEvent(1, 2));
  handleQuestStartedWithoutDifficulty(
    createQuestStartedWithoutDifficultyEvent(USER_ADDRESS, 1, 1)
  );
  handleRandomSeeded(createRandomSeededEvent(2));
  handleQuestRevealed(createQuestRevealedEvent(USER_ADDRESS, 1));

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "10");

  // Set the new Questing XP gained block number
  const blockNumber = 12345678;
  setQuestingXpGainedBlockNumberIfEmpty(BigInt.fromI32(blockNumber));

  // Simulate new quest after block
  handleRandomRequest(createRandomRequestEvent(1, 2));
  handleQuestStartedWithoutDifficulty(
    createQuestStartedWithoutDifficultyEvent(USER_ADDRESS, 1, 1)
  );
  handleRandomSeeded(createRandomSeededEvent(2));
  handleQuestRevealed(
    createQuestRevealedEvent(USER_ADDRESS, 1, 0, 0, 0, 0, blockNumber)
  );

  // Legion should NOT have gained XP
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "10");
});

test("new questing xp increases with event params", () => {
  clearStore();

  // Create Legion
  handleTransfer(
    createLegionTransferEvent(Address.zero().toHexString(), USER_ADDRESS, 1)
  );
  handleLegionCreated(createLegionCreatedEvent(USER_ADDRESS, 1, 0, 6, 2));

  const id = `${LEGION_ADDRESS.toHexString()}-0x1`;
  const metadata = `${id}-metadata`;

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "1");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");

  // Give Legion XP
  handleQuestXpGained(createQuestXpGainedEvent(1, 1, 20));

  // Assert XP is saved
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "1");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "20");

  // Give Legion XP
  handleQuestXpGained(createQuestXpGainedEvent(1, 2, 0));

  // Assert XP is saved
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "2");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");
});

test("questing works with difficulty parameter", () => {
  clearStore();

  const mintEvent = createLegionTransferEvent(
    Address.zero().toHexString(),
    USER_ADDRESS,
    1
  );

  handleTransfer(mintEvent);

  const legionCreatedEvent = createLegionCreatedEvent(USER_ADDRESS, 1, 0, 6, 2);

  handleLegionCreated(legionCreatedEvent);

  const id = `${LEGION_ADDRESS.toHexString()}-0x1`;
  const metadata = `${id}-metadata`;

  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questing", "1");
  assert.fieldEquals(LEGION_INFO_ENTITY_TYPE, metadata, "questingXp", "0");

  const randomRequestEvent = createRandomRequestEvent(1, 2);

  handleRandomRequest(randomRequestEvent);

  const questStartedEvent = createQuestStartedEvent(
    USER_ADDRESS,
    1,
    1,
    Difficulty.Medium
  );

  handleQuestStartedWithDifficulty(questStartedEvent);

  const questId = `${QUESTING_ADDRESS}-0x1`;

  assert.fieldEquals(QUEST_ENTITY_TYPE, questId, "difficulty", "Medium");
});
