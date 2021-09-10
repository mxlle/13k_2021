import './screenControls.scss';

import { createElement } from '../utils';
import { showConfigScreen } from '../configScreen/configScreen';
import { activateClickMode, onSpace } from '../globals';

let playerToControl;

export function initScreenControls() {
  const controlsContainer = createElement({ cssClass: 'controls' });
  const leftBtn = createElement({ cssClass: 'arrow', text: '←', onClick: leftClick });
  const rightBtn = createElement({ cssClass: 'arrow', text: '→', onClick: rightClick });
  const spaceBtn = createElement({ tag: 'button', cssClass: 'space btn', text: 'SPACE', onClick: spaceClick });
  const enterBtn = createElement({ tag: 'button', cssClass: 'enter btn', text: 'Configure', onClick: enterClick });
  controlsContainer.appendChild(leftBtn);
  controlsContainer.appendChild(rightBtn);
  controlsContainer.appendChild(spaceBtn);
  controlsContainer.appendChild(enterBtn);
  document.body.appendChild(controlsContainer);

  document.addEventListener('click', () => {
    activateClickMode();
  });
}

export function registerPlayerForScreenControls(player) {
  playerToControl = player;
}

function leftClick() {
  playerToControl?.controlManually();
  playerToControl?.turnLeft(true); // swapped already in css, so set alreadySwapped
}

function rightClick() {
  playerToControl?.controlManually();
  playerToControl?.turnRight(true); // swapped already in css, so set alreadySwapped
}

function spaceClick() {
  onSpace();
}

function enterClick() {
  showConfigScreen();
}
