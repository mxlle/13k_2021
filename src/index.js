import { init, initKeys, bindKeys } from 'kontra';

import './index.css';

import { addBackgroundScene } from './app/scene';
import { initGame, isGameInitialized, isGameStarted, shuffleAll, startGame } from './app/game';
import { getCats, getObjects } from './app/gameSetup';

let clickMode = false;

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
  bindKeys('space', () => {
    if (clickMode) deactivateClickMode();
    onSpace();
  });
  document.addEventListener('click', (event) => {
    if (!clickMode) activateClickMode();

    if (isGameStarted()) {
      const firstCat = cats[0];

      if (event.target.id === 'left') {
        firstCat.controlManually();
        firstCat.turnLeft();
        return;
      }
      if (event.target.id === 'right') {
        firstCat.controlManually();
        firstCat.turnRight();
        return;
      }
    }

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

function activateClickMode() {
  clickMode = true;
  document.body.classList.add('clickMode');
}

function deactivateClickMode() {
  clickMode = false;
  document.body.classList.remove('clickMode');
}
