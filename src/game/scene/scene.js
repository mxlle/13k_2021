import './scene.scss';

import { randInt } from 'kontra';
import { createElement } from '../utils';

let skyContainer;
let skyColor = 4;

const texts = [
  ' ★ ° . .　 　 .　☾ °☆ 　.  * ¸ 　 . 　 .　 . ● 　 　 ★ 　° : .　 . 　 •  ○ ° ★　 .  　 * 　. . 　 ° ',
  '. .　  　 :.　 . • ° ★　 . 　 * .  ★ ° 　 　.　 ☾ ° ☆ 　. *  ¸ .　 　 　 　. 　 ° 　. ● ★ ° ',
  '　 ○ ° ★ 　 .　  *　. 　 　 . 　 　 . 　🛸 　 　. ★ ° . .　  .　 ☾ °☆ 　. * 　  ¸ .　  　 ★ 　 ° : . 　 . • 　 ° 　 . ● ',
];

export function addBackgroundScene() {
  skyContainer = createElement({ cssClass: 'sky' });
  for (let i = 0; i < 1000; i++) {
    const textNode = document.createTextNode(texts[randInt(0, 2)]);
    skyContainer.appendChild(textNode);
  }
  document.body.appendChild(skyContainer);
}

export function updateSkyColor() {
  skyColor = (skyColor + 1) % 5;
  skyContainer.setAttribute('data-color', skyColor);
}
