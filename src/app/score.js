export const GOAL = 3;

export function updateScoreboard(cats) {
  const catText = cats
    .map((cat) => `${cat.character}&nbsp;[${cat.leftKey}]&nbsp;[${cat.rightKey}]&nbsp;Score:&nbsp;${cat.score}`)
    .join('<br/>');

  document.getElementById('score').innerHTML = `${catText}<br/>Goal:&nbsp;${GOAL}`;
}
