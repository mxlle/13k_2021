import { getCats, getCatsFromString } from './players';
import { getLevelObjects } from './levels';
import { BONUS_LEVEL_CONFIG, getGameObjectsFromString, getObjectCountFromValidLevelConfig, getSupportedLevelConfig } from './customLevel';

const LEVEL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const ObjectSize = {
  XS: 30,
  SMALL: 50,
  MEDIUM: 60,
  LARGE: 70,
  XL: 100,
};

export function isLastLevel(level) {
  return level >= LEVEL_NUMBERS.length;
}

export function getNextLevel(level) {
  return isLastLevel(level) ? level : level + 1;
}

export function getAvailableLevelsAsString() {
  return LEVEL_NUMBERS.map((num) => `${num}`);
}

export function getLevelConfig(_level) {
  const level = Number(_level);
  if (level === 13) return getBonusLevel();
  const size = getBaseObjectSizeFromAmountOfObjects(level + level * 2 - 1); // cats + objects
  const cats = getCats(level, size);
  const objects = getLevelObjects(level, size);

  return {
    cats,
    objects,
    goal: level,
  };
}

function getBonusLevel() {
  return getCustomLevel(BONUS_LEVEL_CONFIG, 13);
}

function getCustomLevel(levelConfig, goal) {
  const validLevelConfig = getSupportedLevelConfig(levelConfig);
  const objectCount = getObjectCountFromValidLevelConfig(validLevelConfig);
  const size = getBaseObjectSizeFromAmountOfObjects(objectCount);
  const cats = getCatsFromString(validLevelConfig, size);
  const objects = getGameObjectsFromString(validLevelConfig, size);

  return { cats, objects, goal };
}

function getBaseObjectSizeFromAmountOfObjects(amount) {
  if (amount < 5) {
    return ObjectSize.XL;
  } else if (amount < 5) {
    return ObjectSize.LARGE;
  } else if (amount < 18) {
    return ObjectSize.MEDIUM;
  } else if (amount < 30) {
    return ObjectSize.SMALL;
  } else {
    return ObjectSize.XS;
  }
}
