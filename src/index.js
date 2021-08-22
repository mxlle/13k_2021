import { init, initKeys, bindKeys } from 'kontra';

import './index.css';

import { addBackgroundScene } from './app/scene';
import { initGame, isGameInitialized, isGameStarted, shuffleAll, startGame } from './app/game';
import { getCats, getObjects } from './app/gameSetup';

// ---------------------------
// setup environment
let { canvas } = init();
resizeCanvas();
addBackgroundScene();
setupEventListeners();

// initialize game
const cats = getCats();
const objects = getObjects();
initGame(cats, objects);
// ---------------------------

function setupEventListeners() {
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  initKeys();

  // space key to start game
  bindKeys('space', onSpace);
  document.addEventListener('click', function () {
    onSpace();
  });
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
