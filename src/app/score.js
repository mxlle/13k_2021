let goal;

export function setGoal(_goal) {
  goal = _goal;
}

export function getGoal() {
  return goal;
}

export function updateScoreboard(cats) {
  const catText = cats.map((cat) => `${cat.getScoreOutput()}`).join('<br/>');

  document.getElementById('score').innerHTML = `${catText}<br/>Goal:&nbsp;${goal}`;
}
