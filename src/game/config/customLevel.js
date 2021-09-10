import { getStoredCustomGoal, getStoredCustomLevelConfig } from '../store';
import { CUSTOM_LEVEL_ID } from '../globals';
import { extraAdventures } from './levels';

export function getCurrentCustomLevelConfig() {
  return getStoredCustomLevelConfig() || extraAdventures[0];
}

export function getCurrentCustomGoal() {
  return getStoredCustomGoal() || CUSTOM_LEVEL_ID;
}
