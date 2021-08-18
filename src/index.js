import { addBackgroundScene } from './app/scene.js';
import { checkWinningCondition, resetVictoryInPosition, updateDisplayedScore } from './app/score.js';

let intervalId;
let intervalCount = 0;

function init() {
  addBackgroundScene();

  document.addEventListener('click', function (event) {
    console.log(event);
    const cat = document.getElementById('cat');
    cat.style.left = event.pageX + 'px';
    cat.style.top = event.pageY + 'px';
    if (Math.random() > 0.2) {
      synthFleesToOtherPosition();
    }
    startIntervalChecking();

    if (event.target.id === 'space-key') {
      toggleGlobalSpace();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
      const cat = document.getElementById('cat');
      cat.classList.add('animated');
    }
  });

  document.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
      const cat = document.getElementById('cat');
      cat.classList.remove('animated');
    }
  });
}

function startIntervalChecking() {
  intervalCount = 0;

  if (!intervalId) {
    intervalId = setInterval(() => {
      checkWinningCondition();
      intervalCount++;
      if (intervalCount >= 20) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    }, 100);
  }
}

function synthFleesToOtherPosition() {
  const synth = document.getElementById('synth');
  synth.style.left = getRandomInt(0, window.innerWidth) + 'px';
  synth.style.top = getRandomInt(0, window.innerHeight) + 'px';
  resetVictoryInPosition();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toggleGlobalSpace() {
  if (document.body.classList.contains('global-space-animation')) {
    document.body.classList.remove('global-space-animation');
  } else {
    document.body.classList.add('global-space-animation');
  }
}

// START
init();
updateDisplayedScore();
