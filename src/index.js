import { init, initKeys, bindKeys } from 'kontra';

import './index.scss';

import { addBackgroundScene } from './app/scene';
import { initGame, isGameInitialized, isGameStarted, isPreparationMode, prepareGame, shuffleAll, startGame } from './app/game';
import { getAvailableLevelsAsString, getLevelConfig } from './app/gameSetup';
import { addBodyClasses, getStoredNumber, removeBodyClasses, storeNumber } from './app/utils';

export const FPS = 45;

export const StoreKey = {
  LEVEL: '🐱🚀🎹.level',
  EXPERT: '🐱🚀🎹.expert',
};
const CLICK_MODE = 'click-mode';

let clickCount = 0;
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
    deactivateClickMode();
    onSpace();
  });

  document.addEventListener('click', (event) => {
    activateClickMode();

    // unlock bonus level
    if (expertMode && isPreparationMode()) {
      clickCount++;
      setTimeout(() => clickCount--, 1000);
      if (clickCount > 4) loadGame(13);
    }

    if (event.target.id === 'space') onSpace();
  });
}

export function setupExpertMode() {
  if (getStoredNumber(StoreKey.EXPERT) && !expertMode) {
    addBodyClasses('expert');
    bindKeys(getAvailableLevelsAsString().concat('0'), (event) => {
      if (isPreparationMode()) {
        const level = event.key === '0' ? 13 : event.key;
        loadGame(level);
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
  if (window.outerWidth < 600) activateClickMode();
  if (isGameInitialized()) shuffleAll();
}

function activateClickMode() {
  addBodyClasses(CLICK_MODE);
}

export function deactivateClickMode() {
  removeBodyClasses(CLICK_MODE);
}
