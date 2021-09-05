import './screenControls.scss';

import { createElement } from '../utils';
import { activateClickMode, isExpertMode, loadGame, onSpace } from '../../index';
import { isPreparationMode } from '../game';

let controlsContainer, leftBtn, rightBtn, spaceBtn, catToControl;
let clickCount = 0;

export function initScreenControls() {
  controlsContainer = createElement({ cssClass: 'controls' });
  leftBtn = createElement({ cssClass: 'arrow', text: '←', onClick: leftClick });
  rightBtn = createElement({ cssClass: 'arrow', text: '→', onClick: rightClick });
  spaceBtn = createElement({ cssClass: 'space', text: 'SPACE', onClick: spaceClick });
  controlsContainer.appendChild(leftBtn);
  controlsContainer.appendChild(rightBtn);
  controlsContainer.appendChild(spaceBtn);
  document.body.appendChild(controlsContainer);

  document.addEventListener('click', () => {
    activateClickMode();

    // unlock bonus level
    if (isExpertMode() && isPreparationMode()) {
      clickCount++;
      setTimeout(() => clickCount--, 1000);
      if (clickCount > 4) loadGame(13);
    }
  });
}

export function registerCatForScreenControls(cat) {
  catToControl = cat;
}

function leftClick() {
  catToControl?.controlManually();
  catToControl?.turnLeft();
}

function rightClick() {
  catToControl?.controlManually();
  catToControl?.turnRight();
}

function spaceClick() {
  onSpace();
}
