import { CatType, GameObject, ObjectType } from '../gameObjects/gameObject';
import { Cat } from '../gameObjects/cat';
import { ALL_CATS } from './players';
import { LEVEL_OBJECTS } from './levels';
import { getStoredCustomGoal, getStoredCustomLevelConfig } from '../store';

export const CUSTOM_LEVEL_ID = 13;

export function getCurrentCustomLevelConfig() {
  const BONUS_LEVEL_DEFAULT_CONFIG = getCatsString() + LEVEL_OBJECTS.join('') + LEVEL_OBJECTS.join('') + '👽👽🐙🐙🍔🍔🍔🍔🍔';
  return getStoredCustomLevelConfig() || BONUS_LEVEL_DEFAULT_CONFIG;
}

export function getCurrentCustomGoal() {
  return getStoredCustomGoal() || CUSTOM_LEVEL_ID;
}

export function getSupportedLevelConfig(levelConfig) {
  let validConfig = getIncludedCatsString(levelConfig);
  if (!validConfig?.length) validConfig = ALL_CATS[0]; // at least one cat

  // special handling for death which is 2 characters
  for (let d = 0; d < getDeathCount(levelConfig); d++) {
    validConfig += ObjectType.DEATH;
  }
  const remainingLevelConfig = removeDeathFrom(levelConfig);

  for (const c of remainingLevelConfig) {
    if (!getCatsString().includes(c) && characterIsEmoji(c)) {
      validConfig += c;
    }
  }

  if (!validConfig.includes(ObjectType.SYNTH)) {
    validConfig += ObjectType.SYNTH;
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
  const validObjectTypes = Object.values(ObjectType).filter((o) => o !== CatType);

  // special handling for death which is 2 characters
  const { deathObjects, remainingObjectsString } = deathEmojiHandling(objectsString, size);
  gameObjects.push(...deathObjects);

  for (const o of remainingObjectsString) {
    if (validObjectTypes.includes(o)) {
      gameObjects.push(new GameObject({ type: o, size }));
    } else if (!getCatsString().includes(o) && characterIsEmoji(o)) {
      if (emojiLives(o)) {
        gameObjects.push(new Cat({ character: o, size, isCustom: true }));
      } else {
        gameObjects.push(new GameObject({ type: o, size, isCustom: true }));
      }
    }
  }

  return gameObjects;
}

function getDeathCount(objectsString) {
  return (objectsString.match(/☠️/g) || []).length;
}

function removeDeathFrom(objectsString) {
  return objectsString.replace(/☠️/g, '');
}

function deathEmojiHandling(objectsString, size) {
  const deathCount = getDeathCount(objectsString);
  const remainingObjectsString = removeDeathFrom(objectsString);
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

function emojiLives(emoji) {
  const regexExp =
    /([\u{02603}\u{026c4}\u{026f4}-\u{026f9}\u{02708}\u{1f385}\u{1f3c2}-\u{1f3c4}\u{1f3c7}\u{1f400}-\u{1f43d}\u{1f43f}\u{1f466}-\u{1f47f}\u{1f481}-\u{1f483}\u{1f486}-\u{1f487}\u{1f574}-\u{1f575}\u{1f577}\u{1f57a}\u{1f600}-\u{1f64c}\u{1f64d}-\u{1f64e}\u{1f680}-\u{1f68e}\u{1f690}-\u{1f6a4}\u{1f6b2}\u{1f6b4}-\u{1f6b5}\u{1f6e5}\u{1f6e9}\u{1f691}-\u{1f697}\u{1f920}-\u{1f931}\u{1f934}-\u{1f93e}\u{1f970}-\u{1f97a}\u{1f980}-\u{1f9ae}\u{1f9cd}\u{1f9cf}-\u{1f9df}\u{1fab0}-\u{1fab3}])/giu;

  return regexExp.test(emoji);
}

function getCatsString() {
  return ALL_CATS.join('');
}

function getIncludedCatsString(objectsString) {
  return ALL_CATS.filter((char) => objectsString.includes(char)).join('');
}
