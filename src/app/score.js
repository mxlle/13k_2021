const HIGH_SCORE_KEY = 'mxlle.spacecat.highScore';

let score = 0;
let victoryInPosition = false;

export function checkWinningCondition() {
  const cat = document.getElementById('cat');
  const synth = document.getElementById('synth');
  const catBox = cat.getBoundingClientRect();
  const synthBox = synth.getBoundingClientRect();

  const overlap = !(
    catBox.right < synthBox.left ||
    catBox.left > synthBox.right ||
    catBox.bottom < synthBox.top ||
    catBox.top > synthBox.bottom
  );

  if (overlap) {
    document.body.classList.add('victory');
  } else {
    document.body.classList.remove('victory');
  }

  if (overlap && !victoryInPosition) {
    score++;
    victoryInPosition = true;
    updateDisplayedScore();
  }
}

export function updateDisplayedScore() {
  let highScore = getHighScore();
  if (score > highScore) {
    highScore = score;
    saveHighScore(highScore);
  }
  document.getElementById('score').innerHTML = `Current&nbsp;Score:&nbsp;${score}<br/>High&nbsp;Score:&nbsp;${highScore}`;
}

export function resetVictoryInPosition() {
  victoryInPosition = false;
}

function getHighScore() {
  return Number(localStorage.getItem(HIGH_SCORE_KEY));
}

function saveHighScore(score) {
  localStorage.setItem(HIGH_SCORE_KEY, score);
}
