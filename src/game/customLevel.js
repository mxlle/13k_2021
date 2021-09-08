import { CatType, GameObject, ObjectType } from './gameObjects/gameObject';
import { Cat } from './gameObjects/cat';
import { ALL_PLAYERS, getCatsString, getIncludedCatsString } from './players';
import { LEVEL_OBJECTS } from './levels';

const validObjectTypes = Object.values(ObjectType).filter((o) => o !== CatType);
const reservedEmojis = ALL_PLAYERS.map((p) => p.character);

export const BONUS_LEVEL_CONFIG = getCatsString() + LEVEL_OBJECTS.join('') + LEVEL_OBJECTS.join('') + '👽👽👽👽';

export function getSupportedLevelConfig(levelConfig) {
  let validConfig = getIncludedCatsString(levelConfig);
  if (!validConfig?.length) validConfig = ALL_PLAYERS[0].character; // at least one cat

  for (const c of levelConfig) {
    if (!reservedEmojis.includes(c) && characterIsEmoji(c)) {
      validConfig += c;
    }
  }

  // special handling for death which is 2 characters
  for (let d = 0; d < getDeathCount(levelConfig); d++) {
    validConfig += ObjectType.DEATH;
  }

  return validConfig;
}

export function getObjectCountFromValidLevelConfig(levelConfig) {
  let count = 0;
  for (const o of levelConfig) {
    count++;
  }

  // special handling for death which is 2 characters
  count -= getDeathCount(levelConfig);

  return count;
}

export function getGameObjectsFromString(objectsString, size) {
  const gameObjects = [];

  // special handling for death which is 2 characters
  const { deathObjects, remainingObjectsString } = deathEmojiHandling(objectsString, size);
  gameObjects.push(...deathObjects);

  for (const o of remainingObjectsString) {
    if (validObjectTypes.includes(o)) {
      gameObjects.push(new GameObject({ type: o, size }));
    } else if (!reservedEmojis.includes(o) && characterIsEmoji(o)) {
      gameObjects.push(new Cat({ character: o, size }));
    }
  }

  return gameObjects;
}

function getDeathCount(objectsString) {
  return (objectsString.match(/☠️/g) || []).length;
}

function deathEmojiHandling(objectsString, size) {
  const deathCount = getDeathCount(objectsString);
  const remainingObjectsString = objectsString.replace(/☠️/g, '');
  const deathObjects = [];
  for (let i = 0; i < deathCount; i++) {
    deathObjects.push(new GameObject({ type: ObjectType.DEATH, size }));
  }
  return { deathCount, deathObjects, remainingObjectsString };
}

function characterIsEmoji(char) {
  const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

  return regexExp.test(char);
}
