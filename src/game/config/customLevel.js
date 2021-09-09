import { getStoredCustomGoal, getStoredCustomLevelConfig } from '../store';
import { CUSTOM_LEVEL_ID } from '../globals';
import { getAllPlayers } from './players';
import { BASE_ADVENTURE_OBJECTS } from './levels';

export function getCurrentCustomLevelConfig() {
  const BONUS_LEVEL_DEFAULT_CONFIG =
    getAllPlayers().join('') + BASE_ADVENTURE_OBJECTS.join('') + BASE_ADVENTURE_OBJECTS.join('') + '👽👽🐙🐙🍔🍔🍔🍔🍔';
  return getStoredCustomLevelConfig() || BONUS_LEVEL_DEFAULT_CONFIG;
}

export function getCurrentCustomGoal() {
  return getStoredCustomGoal() || CUSTOM_LEVEL_ID;
}
