import { bindKeys, init, initKeys } from 'kontra';

import './index.scss';

import { addBackgroundScene } from './game/scene/scene';
import { initGame, isGameInitialized, isGameStarted, isPreparationMode, prepareGame, shuffleAndScaleAll, startGame } from './game/game';
import { getAvailableLevelsAsString, getLevelConfig } from './game/config/gameSetup';
import { addBodyClasses, addCanvasToBody, getWidthHeightScale, removeBodyClasses } from './game/utils';
import { initHints, updateHints } from './game/hints/hints';
import { initScreenControls } from './game/screenControls/screenControls';
import { setObjectScale } from './game/gameObjects/collisionDetector';
import { configureIsShown, initConfigScreen } from './game/configScreen/configScreen';
import { CUSTOM_LEVEL_ID } from './game/config/customLevel';
import { getStoredExportMode, getStoredLevel, storeLevel } from './game/store';

export const FPS = 60;

const CLICK_MODE = 'click-mode';

let expertMode = false;

// ---------------------------
// setup environment
addCanvasToBody();
addBackgroundScene();
initHints();
initScreenControls();
let { canvas } = init();
resizeCanvas();
setupEventListeners();
setupExpertMode();

// initialize game
prepareGame();

// ---------------------------

export function loadGame(nextLevel) {
  if (nextLevel) {
    storeLevel(nextLevel);
  }
  const level = getStoredLevel() || 1;
  const { cats, objects, goal } = getLevelConfig(level);
  initGame(cats, objects, goal, level);
  updateHints();
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
}

export function setupExpertMode() {
  if (getStoredExportMode() && !expertMode) {
    addBodyClasses('expert');
    bindKeys(getAvailableLevelsAsString().concat('0'), (event) => {
      if (isPreparationMode() && !configureIsShown()) {
        const level = event.key === '0' ? CUSTOM_LEVEL_ID : event.key;
        loadGame(level);
      }
    });
    initConfigScreen();
    expertMode = true;
  }
}

export function onSpace() {
  if (!isGameStarted() && !configureIsShown()) {
    if (isPreparationMode()) {
      startGame();
    } else {
      prepareGame();
    }
  }
}

function resizeCanvas() {
  const { width, height, scale } = getWidthHeightScale();
  canvas.width = width;
  canvas.height = height;
  setObjectScale(scale); // adapt object size based on screen size
  if (window.outerWidth < 600) activateClickMode();
  if (isGameInitialized()) shuffleAndScaleAll();
}

export function activateClickMode() {
  addBodyClasses(CLICK_MODE);
}

export function deactivateClickMode() {
  removeBodyClasses(CLICK_MODE);
}

export function isExpertMode() {
  return expertMode;
}
