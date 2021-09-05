import './score.scss';
import { createElement } from '../utils';

let scoreBoard;

let goal = 0;
let cats = [];

export function initScoreboard(_goal, _cats) {
  if (!scoreBoard) {
    scoreBoard = createElement({ cssClass: 'score' });
    document.body.appendChild(scoreBoard);
  }
  goal = _goal;
  cats = _cats;
  updateScoreboard();
}

export function getGoal() {
  return goal;
}

export function updateScoreboard() {
  const catText = cats.map((cat) => `${cat.getScoreOutput()}`).join('');
  scoreBoard.innerHTML = `${catText}<div class="goal">Goal:&nbsp;${goal}</div>`;
}
