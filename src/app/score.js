export const GOAL = 3;

export function updateScoreboard(cats) {
  const catText = cats.map((cat) => `${cat.getScoreOutput()}`).join('<br/>');

  document.getElementById('score').innerHTML = `${catText}<br/>Goal:&nbsp;${GOAL}`;
}
