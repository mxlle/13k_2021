import './configScreen.scss';

import { createElement } from '../utils';
import { bindKeys } from 'kontra';
import { storeCustomGoal, storeCustomLevelConfig } from '../store';
import { CUSTOM_LEVEL_ID, deactivateClickMode, loadGame } from '../globals';
import { getCurrentCustomGoal, getCurrentCustomLevelConfig } from '../config/customLevel';

const MIN_GOAL = 1;
const MAX_GOAL = 13312;

let configScreen, shown, textarea, goalInput;

export function configureIsShown() {
  return shown;
}

export function initConfigScreen() {
  bindKeys('enter', (event) => {
    deactivateClickMode();
    if (shown) {
      closeConfigScreen(true);
    } else {
      showConfigScreen();
    }
    event.preventDefault(); // to not add enter in textarea
  });
  bindKeys('esc', () => {
    deactivateClickMode();
    if (shown) {
      closeConfigScreen(false);
    }
  });
}

export function showConfigScreen() {
  if (!configScreen) createConfigScreen();
  textarea.value = getCurrentCustomLevelConfig();
  goalInput.value = getCurrentCustomGoal();
  document.body.appendChild(configScreen);
  textarea.focus();
  shown = true;
}

function closeConfigScreen(loadNewLevel) {
  if (loadNewLevel) {
    storeCustomLevelConfig(textarea.value);
    storeCustomGoal(goalInput.value);
    loadGame(CUSTOM_LEVEL_ID);
  }
  document.body.removeChild(configScreen);
  shown = false;
}

function createConfigScreen() {
  configScreen = createElement({ cssClass: 'config', onClick: (event) => event.stopPropagation() });
  const desc = createElement({ cssClass: 'config-desc', text: 'Add and remove emojis from the textarea' });
  configScreen.appendChild(desc);
  textarea = createElement({ tag: 'textarea' });
  configScreen.appendChild(textarea);
  const goalContainer = createElement({ cssClass: 'goal-input', text: 'Goal:' });
  goalInput = createElement({ tag: 'input' });
  goalInput.type = 'number';
  goalInput.min = MIN_GOAL;
  goalInput.max = MAX_GOAL;
  goalInput.addEventListener('blur', validateGoal);
  goalContainer.appendChild(goalInput);
  configScreen.appendChild(goalContainer);
  const closeButton = createElement({ cssClass: 'close-btn', text: 'Apply config', onClick: closeConfigScreen });
  configScreen.appendChild(closeButton);
}

function validateGoal() {
  const goal = goalInput.value;
  if (goal < MIN_GOAL) {
    goalInput.value = MIN_GOAL;
  } else if (goal > MAX_GOAL) {
    goalInput.value = MAX_GOAL;
  }
}
