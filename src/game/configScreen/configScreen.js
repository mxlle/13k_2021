import './configScreen.scss';

import { createElement } from '../utils';
import { bindKeys } from 'kontra';
import { getCustomLevelFromStore, saveCustomLevelInStore } from '../customLevel';
import { loadGame } from '../../index';

let configScreen, shown, input;

export function initConfigScreen() {
  bindKeys('enter', (event) => {
    if (shown) {
      closeConfigScreen(true);
    } else {
      showConfigScreen();
    }
    event.preventDefault(); // to not add enter in textarea
  });
  bindKeys('esc', () => {
    if (shown) {
      closeConfigScreen(false);
    }
  });
}

export function showConfigScreen() {
  if (!configScreen) createConfigScreen();
  input.value = getCustomLevelFromStore();
  document.body.appendChild(configScreen);
  input.focus();
  shown = true;
}

function closeConfigScreen(loadNewLevel) {
  if (loadNewLevel) {
    saveCustomLevelInStore(input.value);
    loadGame(13); // TODO
  }
  document.body.removeChild(configScreen);
  shown = false;
}

function createConfigScreen() {
  configScreen = createElement({ cssClass: 'config', onClick: (event) => event.stopPropagation() });
  const desc = createElement({ cssClass: 'config-desc', text: 'Add and remove emojis from the textarea' });
  configScreen.appendChild(desc);
  input = createElement({ tag: 'textarea' });
  configScreen.appendChild(input);
  const closeButton = createElement({ cssClass: 'close-btn', text: 'Apply config', onClick: closeConfigScreen });
  configScreen.appendChild(closeButton);
}
