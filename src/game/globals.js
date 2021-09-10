import { addBodyClasses, removeBodyClasses } from './utils';

// CONSTANTS
export const FPS = 60;
export const CUSTOM_LEVEL_ID = 13;
export const TRAP_TIME = 5000;

// GAME STATE
let gameInitialized = false;
let gameStarted = false;
let gameEnded = false;
let preparationMode = false;

export const isGameInitialized = () => gameInitialized;
export const isGameStarted = () => gameStarted;
export const isGameEnded = () => gameEnded;
export const isPreparationMode = () => preparationMode;
export const setGameInitialized = (value) => (gameInitialized = value);
export const setGameStarted = (value) => (gameStarted = value);
export const setGameEnded = (value) => (gameEnded = value);
export const setPreparationMode = (value) => (preparationMode = value);

// CURRENT LEVEL
let currentLevel;
export const getCurrentLevel = () => currentLevel;
export const setCurrentLevel = (level) => (currentLevel = level);

// EXPERT MODE
let expertMode = false;
export const isExpertMode = () => expertMode;
export const setExpertMode = () => (expertMode = true);

// LOAD GAME
let loadGameFn = () => {};
export const initLoadGameHandler = (fn) => (loadGameFn = fn);
export function loadGame(...args) {
  return loadGameFn(...args);
}

// ON SPACE
let onSpaceFn = () => {};
export const initOnSpaceHandler = (fn) => (onSpaceFn = fn);
export function onSpace(...args) {
  return onSpaceFn(...args);
}

// CLICK MODE
const CLICK_MODE = 'click-mode';

export function activateClickMode() {
  addBodyClasses(CLICK_MODE);
}
export function deactivateClickMode() {
  removeBodyClasses(CLICK_MODE);
}

// LEVEL VALIDATOR
let validatorFn = () => {};
export const initLevelValidator = (fn) => (validatorFn = fn);
export function getSupportedLevelConfigArray(...args) {
  return validatorFn(...args);
}
