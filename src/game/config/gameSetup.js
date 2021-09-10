import { getAllPlayers, getPlayerConfigs } from './players';
import { baseAdventures } from './levels';
import { getGameObjectsFromConfigArray } from './levelConfig';
import { CUSTOM_LEVEL_ID, getSupportedLevelConfigArray } from '../globals';
import { getCurrentCustomGoal, getCurrentCustomLevelConfig } from './customLevel';
import { Player } from '../gameObjects/player';

const ObjectSize = {
  XS: 30,
  SMALL: 50,
  MEDIUM: 60,
  LARGE: 70,
  XL: 100,
};

export function isLastLevel(level) {
  return level >= baseAdventures.length;
}

export function getNextLevel(level) {
  return isLastLevel(level) ? CUSTOM_LEVEL_ID : level + 1;
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
    levelConfig = baseAdventures[level - 1].config;
    goal = baseAdventures[level - 1].goal;
  }

  const validLevelConfigArray = getSupportedLevelConfigArray(levelConfig);
  const size = getBaseObjectSizeFromAmountOfObjects(validLevelConfigArray.length);
  const players = getPlayersFromConfigArray(validLevelConfigArray, size);
  const objects = getGameObjectsFromConfigArray(validLevelConfigArray, size);

  return { players, objects, goal };
}

function getPlayersFromConfigArray(configArray, size) {
  return getPlayerConfigs(getAllPlayers().filter((emoji) => configArray.includes(emoji))).map((config) => new Player({ ...config, size }));
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
