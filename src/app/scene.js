import { randInt } from 'kontra';

let skyColor = 4;

const texts = [
  ' ★ ° . .　 　 .　☾ °☆ 　.  * ¸ 　 . 　 .　 . ● 　 　 ★ 　° : .　 . 　 •  ○ ° ★　 .  　 * 　. . 　 ° ',
  '. .　  　 :.　 . • ° ★　 . 　 * .  ★ ° 　 　.　 ☾ ° ☆ 　. *  ¸ .　 　 　 　. 　 ° 　. ● ★ ° ',
  '　 ○ ° ★ 　 .　  *　. 　 　 . 　 　 . 　🛸 　 　. ★ ° . .　  .　 ☾ °☆ 　. * 　  ¸ .　  　 ★ 　 ° : . 　 . • 　 ° 　 . ● ',
];

export function addBackgroundScene() {
  for (let i = 0; i < 1000; i++) {
    const textNode = document.createTextNode(texts[randInt(0, 2)]);
    document.getElementById('sky').appendChild(textNode);
  }
}

export function updateSkyColor() {
  skyColor = (skyColor + 1) % 5;
  document.body.setAttribute('data-color', skyColor);
}
