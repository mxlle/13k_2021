import { init, GameLoop, Text, initKeys, bindKeys, collides } from '../node_modules/kontra/kontra.mjs';

import { Cat } from './app/cat.js';
import { addBackgroundScene } from './app/scene.js';
import { resetScores, updateDisplayedScore, updateScore } from './app/score.js';
import { wormhole } from './app/wormhole.js';

let gameStarted = false;
let { canvas } = init();
initKeys();

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

bindKeys('space', onSpace);

let synth = Text({
  text: '🎹',
  font: '100px sans-serif',
});
wormhole(synth);

let rocket = Text({
  text: '🚀',
  font: '50px sans-serif',
});
wormhole(rocket);

const cat1 = new Cat('🐈', 'left', 'right', 1);
const cat2 = new Cat('🐱', 'a', 'd', 2);

let loop = GameLoop({
  // create the main game loop
  update: function () {
    if (!gameStarted) return;

    // update the game state
    cat1.move();
    cat2.move();

    const c1 = collides(cat1.obj, synth);
    const c2 = collides(cat2.obj, synth);
    let goalReached = false;

    if (c1) {
      goalReached ||= updateScore(1);
    }
    if (c2) {
      goalReached ||= updateScore(2);
    }

    if (goalReached) {
      endGame();
      return;
    } else if (c1 || c2) {
      wormhole(synth);
    }

    if (collides(rocket, cat1.obj)) {
      cat1.wormhole();
      wormhole(rocket);
    }
    if (collides(rocket, cat2.obj)) {
      cat2.wormhole();
      wormhole(rocket);
    }

    if (collides(cat1.obj, cat2.obj)) {
      cat1.wormhole();
      cat2.wormhole();
      cat1.slowDown();
      cat2.slowDown();
    }
  },
  render: function () {
    // render the game state
    synth.render();
    rocket.render();
    cat1.obj.render();
    cat2.obj.render();
  },
});

function onSpace() {
  if (gameStarted) {
    speedUpCats();
  } else {
    startGame();
  }
}

function speedUpCats() {
  cat1.speedUp();
  cat2.speedUp();
}

function stopCats() {
  cat1.stop();
  cat2.stop();
}

function endGame() {
  gameStarted = false;
  stopCats();
  document.body.classList.add('victory');
}

function startGame() {
  if (document.body.classList.contains('victory')) {
    wormhole(synth);
    resetScores();
  }
  document.body.classList.remove('victory');
  gameStarted = true;
  speedUpCats();
}

document.addEventListener('click', function (event) {
  if (event.target.id === 'space-key') {
    onSpace();
  }
});

// START
addBackgroundScene();
updateDisplayedScore();
loop.start();
