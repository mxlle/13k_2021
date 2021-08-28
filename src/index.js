import { init, initKeys, bindKeys, getStoreItem, setStoreItem } from 'kontra';

import './index.scss';

import { addBackgroundScene } from './app/scene';
import { getFirstCat, initGame, isGameInitialized, isGameStarted, shuffleAll, startGame } from './app/game';
import { getAvailableLevels, getLevelConfig } from './app/gameSetup';

export const StoreKey = {
  LEVEL: '🐱🚀🎹.level',
  EXPERT: '🐱🚀🎹.expert',
};

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
loadLevel();

// ---------------------------

export function loadLevel(nextLevel) {
  if (nextLevel) {
    setStoreItem(StoreKey.LEVEL, nextLevel);
  }
  const level = getStoreItem(StoreKey.LEVEL) || 1;
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

    const firstCat = getFirstCat();
    firstCat.controlManually();

    if (isGameStarted()) {
      if (event.target.id === 'left') {
        firstCat.turnLeft();
      }
      if (event.target.id === 'right') {
        firstCat.turnRight();
      }
    }

    onSpace();
  });
}

export function setupExpertMode() {
  if (getStoreItem(StoreKey.EXPERT) && !expertMode) {
    bindKeys(getAvailableLevels(), (event) => {
      setStoreItem(StoreKey.LEVEL, event.key);
      loadLevel();
    });
    expertMode = true;
  }
}

function onSpace() {
  if (!isGameStarted()) {
    startGame();
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (isGameInitialized()) shuffleAll();
}

function activateClickMode() {
  clickMode = true;
  document.body.classList.add('click-mode');
}

export function deactivateClickMode() {
  clickMode = false;
  document.body.classList.remove('click-mode');
}
