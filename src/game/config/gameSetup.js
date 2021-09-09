import { ALL_CATS, getAllPlayers, getPlayerConfigs } from './players';
import { BASE_ADVENTURE_OBJECTS } from './levels';
import { getGameObjectsFromConfigArray, getSupportedLevelConfigArray } from './levelConfig';
import { CUSTOM_LEVEL_ID } from '../globals';
import { getCurrentCustomGoal, getCurrentCustomLevelConfig } from './customLevel';
import { Player } from '../gameObjects/player';

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
  let levelConfig, goal;
  if (level === CUSTOM_LEVEL_ID) {
    // custom configuration
    levelConfig = getCurrentCustomLevelConfig();
    goal = getCurrentCustomGoal();
  } else {
    // predefined levels 1 - 9
    levelConfig = ALL_CATS.slice(0, level).join('') + BASE_ADVENTURE_OBJECTS.slice(0, level * 2 - 1).join();
    goal = level;
  }

  const validLevelConfigArray = getSupportedLevelConfigArray(levelConfig);
  const size = getBaseObjectSizeFromAmountOfObjects(validLevelConfigArray.length);
  const players = getPlayersFromConfigArray(validLevelConfigArray, size);
  const objects = getGameObjectsFromConfigArray(validLevelConfigArray, size);

  return { players, objects, goal };
}

function getPlayersFromConfigArray(configArray, size) {
  return getPlayerConfigs(getAllPlayers())
    .filter((config) => configArray.includes(config.emoji))
    .map((config) => new Player({ ...config, size }));
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