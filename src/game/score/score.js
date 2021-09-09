import './score.scss';
import { createElement } from '../utils';

let scoreBoard;

let goal = 0;
let players = [];

export function initScoreboard(_goal, _players) {
  if (!scoreBoard) {
    scoreBoard = createElement({ cssClass: 'score' });
    document.body.appendChild(scoreBoard);
  }
  goal = _goal;
  players = _players;
  updateScoreboard();
}

export function getGoal() {
  return goal;
}

export function updateScoreboard() {
  const playerText = players.map((player) => `${player.getScoreOutput()}`).join('');
  scoreBoard.innerHTML = `${playerText}<div class="goal">Goal:&nbsp;${goal}</div>`;
}
