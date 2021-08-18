const HIGH_SCORE_KEY = 'mxlle.spacecat.highScore';
const GOAL = 5;

let score1 = 0;
let score2 = 0;

export function updateScore(id) {
  if (id === 1) {
    score1++;
  } else {
    score2++;
  }

  updateDisplayedScore();

  return score1 === GOAL || score2 === GOAL;
}

export function updateDisplayedScore() {
  document.getElementById(
    'score'
  ).innerHTML = `🐈&nbsp;[&larr;]&nbsp;[&rarr;]&nbsp;Score:&nbsp;${score1}<br/>🐱&nbsp;[A]&nbsp;[D]&nbsp;Score:&nbsp;${score2}<br/>Goal:&nbsp;${GOAL}`;
}

export function resetScores() {
  score1 = 0;
  score2 = 0;
  updateDisplayedScore();
}

function getHighScore() {
  return Number(localStorage.getItem(HIGH_SCORE_KEY));
}

function saveHighScore(score) {
  localStorage.setItem(HIGH_SCORE_KEY, score);
}
