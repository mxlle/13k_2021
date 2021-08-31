import { init, initKeys, bindKeys } from 'kontra';

import './index.scss';

import { addBackgroundScene } from './app/scene';
import { getFirstCat, initGame, isGameInitialized, isGameStarted, isPreparationMode, prepareGame, shuffleAll, startGame } from './app/game';
import { getAvailableLevelsAsString, getLevelConfig } from './app/gameSetup';
import { addBodyClasses, getStoredNumber, removeBodyClasses, storeNumber } from './app/utils';

export const StoreKey = {
  LEVEL: '🐱🚀🎹.level',
  EXPERT: '🐱🚀🎹.expert',
};
const CLICK_MODE = 'click-mode';

let clickMode = false;
let expertMode = false;

// ---------------------------
// setup environment
let { canvas } = init();
resizeCanvas();
addBackgroundScene();
setupEventListeners();
setupExpertMode();

// initialize game
prepareGame();

// ---------------------------

export function loadGame(nextLevel) {
  if (nextLevel) {
    storeNumber(StoreKey.LEVEL, nextLevel);
  }
  const level = getStoredNumber(StoreKey.LEVEL) || 1;
  const { cats, objects, goal } = getLevelConfig(level);
  initGame(cats, objects, goal);
}

function setupEventListeners() {
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  initKeys();

  // space key to start game
  bindKeys('space', () => {
    if (clickMode) deactivateClickMode();
    onSpace();
  });

  document.addEventListener('click', (event) => {
    if (!clickMode) activateClickMode();

    onSpace();

    const firstCat = getFirstCat();
    firstCat.controlManually();

    if (event.target.id === 'left') {
      firstCat.turnLeft();
    }
    if (event.target.id === 'right') {
      firstCat.turnRight();
    }
  });
}

export function setupExpertMode() {
  if (getStoredNumber(StoreKey.EXPERT) && !expertMode) {
    bindKeys(getAvailableLevelsAsString(), (event) => {
      if (isPreparationMode()) {
        storeNumber(StoreKey.LEVEL, event.key);
        prepareGame();
      }
    });
    expertMode = true;
  }
}

function onSpace() {
  if (!isGameStarted()) {
    if (isPreparationMode()) {
      startGame();
    } else {
      prepareGame();
    }
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (isGameInitialized()) shuffleAll();
}

function activateClickMode() {
  clickMode = true;
  addBodyClasses(CLICK_MODE);
}

export function deactivateClickMode() {
  clickMode = false;
  removeBodyClasses(CLICK_MODE);
}
