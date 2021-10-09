import { bindKeys, init, initKeys } from 'kontra';

import './index.scss';

import { addBackgroundScene } from './game/scene/scene';
import { initGame, prepareGame, shuffleAndScaleAll, startGame } from './game/game';
import { addCanvasToBody, getWidthHeightScale } from './game/utils';
import { initHints, updateHints } from './game/hints/hints';
import { initScreenControls } from './game/screenControls/screenControls';
import { setObjectScale } from './game/gameObjects/collisionDetector';
import { setupExpertMode } from './game/config/expertMode';
import {
  activateClickMode,
  deactivateClickMode,
  initLoadGameHandler,
  initOnSpaceHandler,
  isGameInitialized,
  isGameStarted,
  isPreparationMode,
} from './game/globals';
import { getStoredLevel, storeExpertMode, storeLevel } from './game/store';
import { getLevelConfig } from './game/config/gameSetup';
import { configureIsShown } from './game/configScreen/configScreen';

// ---------------------------
// setup environment
addCanvasToBody();
addBackgroundScene();
initHints();
initScreenControls();
let { canvas } = init();
resizeCanvas();
setupEventListeners();
storeExpertMode(); // activate expert mode from beginning
setupExpertMode();

// initialize game
initOnSpaceHandler(onSpace);
initLoadGameHandler(loadGame);
prepareGame();

// ---------------------------

function loadGame(nextLevel) {
  if (nextLevel) {
    storeLevel(nextLevel);
  }
  const level = getStoredLevel() || 1;
  const { players, objects, goal } = getLevelConfig(level);
  initGame(players, objects, goal, level);
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

function onSpace() {
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
