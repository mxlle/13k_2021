const STORE_NAMESPACE = '🐱🚀🎹';

const StoreKey = {
  LEVEL: `${STORE_NAMESPACE}.level`,
  EXPERT: `${STORE_NAMESPACE}.expert`,
  CUSTOM_LEVEL: `${STORE_NAMESPACE}.customLevel`,
  CUSTOM_GOAL: `${STORE_NAMESPACE}.customGoal`,
};

export function getStoredLevel() {
  return getStoredNumber(StoreKey.LEVEL);
}

export function storeLevel(level) {
  storeNumber(StoreKey.LEVEL, level);
}

export function getStoredCustomGoal() {
  return getStoredNumber(StoreKey.CUSTOM_GOAL);
}

export function storeCustomGoal(goal) {
  storeNumber(StoreKey.CUSTOM_GOAL, goal);
}

export function getStoredCustomLevelConfig() {
  return localStorage.getItem(StoreKey.CUSTOM_LEVEL);
}

export function storeCustomLevelConfig(levelConfig) {
  localStorage.setItem(StoreKey.CUSTOM_LEVEL, levelConfig);
}

export function getStoredExportMode() {
  return getStoredNumber(StoreKey.EXPERT);
}

export function storeExportMode() {
  storeNumber(StoreKey.EXPERT, 1);
}

function getStoredNumber(id) {
  const num = Number(localStorage.getItem(id));
  return isNaN(num) ? 0 : num;
}

function storeNumber(id, num) {
  localStorage.setItem(id, `${num}`);
}
