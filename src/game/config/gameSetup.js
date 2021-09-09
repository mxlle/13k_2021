import { getCats, getCatsFromConfigArray } from './players';
import { getLevelObjects } from './levels';
import {
  CUSTOM_LEVEL_ID,
  getCurrentCustomGoal,
  getCurrentCustomLevelConfig,
  getGameObjectsFromConfigArray,
  getSupportedLevelConfigArray,
} from './customLevel';

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
  return isLastLevel(level) ? CUSTOM_LEVEL_ID : level + 1;
}

export function getAvailableLevelsAsString() {
  return LEVEL_NUMBERS.map((num) => `${num}`);
}

export function getLevelConfig(_level) {
  const level = Number(_level);
  if (level === CUSTOM_LEVEL_ID) {
    // custom configuration
    return getCustomLevel(getCurrentCustomLevelConfig(), getCurrentCustomGoal());
  } else {
    // predefined levels 1 - 9
    const size = getBaseObjectSizeFromAmountOfObjects(level + level * 2 - 1); // cats + objects // TODO
    const cats = getCats(level, size);
    const objects = getLevelObjects(level, size);

    return {
      cats,
      objects,
      goal: level,
    };
  }
}

function getCustomLevel(levelConfig, goal) {
  const validLevelConfigArray = getSupportedLevelConfigArray(levelConfig);
  const size = getBaseObjectSizeFromAmountOfObjects(validLevelConfigArray.length);
  const cats = getCatsFromConfigArray(validLevelConfigArray, size);
  const objects = getGameObjectsFromConfigArray(validLevelConfigArray, size);

  return { cats, objects, goal };
}

// the more objects the smaller they should be
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
