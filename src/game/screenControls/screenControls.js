import './screenControls.scss';

import { createElement } from '../utils';
import { activateClickMode, isExpertMode, loadGame, onSpace } from '../../index';
import { isPreparationMode } from '../game';
import { showConfigScreen } from '../configScreen/configScreen';
import { CUSTOM_LEVEL_ID } from '../config/levelConfig';

let playerToControl;
let clickCount = 0;

export function initScreenControls() {
  const controlsContainer = createElement({ cssClass: 'controls' });
  const leftBtn = createElement({ cssClass: 'arrow', text: '←', onClick: leftClick });
  const rightBtn = createElement({ cssClass: 'arrow', text: '→', onClick: rightClick });
  const spaceBtn = createElement({ cssClass: 'space', text: 'SPACE', onClick: spaceClick });
  const enterBtn = createElement({ cssClass: 'enter', text: 'Configure', onClick: enterClick });
  controlsContainer.appendChild(leftBtn);
  controlsContainer.appendChild(rightBtn);
  controlsContainer.appendChild(spaceBtn);
  controlsContainer.appendChild(enterBtn);
  document.body.appendChild(controlsContainer);

  document.addEventListener('click', () => {
    activateClickMode();

    // unlock bonus level
    if (isExpertMode() && isPreparationMode()) {
      clickCount++;
      setTimeout(() => clickCount--, 1000);
      if (clickCount > 4) loadGame(CUSTOM_LEVEL_ID);
    }
  });
}

export function registerPlayerForScreenControls(player) {
  playerToControl = player;
}

function leftClick() {
  playerToControl?.controlManually();
  playerToControl?.turnLeft();
}

function rightClick() {
  playerToControl?.controlManually();
  playerToControl?.turnRight();
}

function spaceClick() {
  onSpace();
}

function enterClick() {
  showConfigScreen();
}
