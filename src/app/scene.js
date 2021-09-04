import { randInt } from 'kontra';

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
