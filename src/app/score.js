let goal = 0;
let cats = [];

export function initScoreboard(_goal, _cats) {
  goal = _goal;
  cats = _cats;
  updateScoreboard();
}

export function getGoal() {
  return goal;
}

export function updateScoreboard() {
  const catText = cats.map((cat) => `${cat.getScoreOutput()}`).join('');

  document.getElementById('score').innerHTML = `${catText}<div class="goal">Goal:&nbsp;${goal}</div>`;
}
