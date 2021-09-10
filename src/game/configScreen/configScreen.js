import './configScreen.scss';

import { createElement } from '../utils';
import { bindKeys } from 'kontra';
import { storeCustomGoal, storeCustomLevelConfig } from '../store';
import { CUSTOM_LEVEL_ID, deactivateClickMode, loadGame } from '../globals';
import { getCurrentCustomGoal, getCurrentCustomLevelConfig } from '../config/customLevel';
import { getAllPlayers } from '../config/players';
import { getValidObjectTypes } from '../config/objectType';
import { getSupportedLevelConfigArray } from '../config/levelConfig';
import { extraAdventures } from '../config/levels';

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
  setConfigValue(getCurrentCustomLevelConfig());
  goalInput.value = getCurrentCustomGoal();
  document.body.appendChild(configScreen);
  textarea.focus();
  shown = true;
}

function closeConfigScreen(loadNewLevel) {
  if (loadNewLevel) {
    storeCustomLevelConfig(getConfigValue());
    storeCustomGoal(goalInput.value);
    loadGame(CUSTOM_LEVEL_ID);
  }
  document.body.removeChild(configScreen);
  shown = false;
}

function createConfigScreen() {
  configScreen = createElement({ cssClass: 'config', onClick: (event) => event.stopPropagation() });
  const desc = createElement({ cssClass: 'config-desc', text: 'Choose a new adventure or create your own' });
  configScreen.appendChild(desc);
  configScreen.appendChild(createThemeButtons(extraAdventures));
  textarea = createElement({ tag: 'textarea' });
  textarea.addEventListener('input', validateConfig);
  configScreen.appendChild(textarea);
  configScreen.appendChild(createEmojiButtons(getAllPlayers(), true));
  configScreen.appendChild(createEmojiButtons([...getValidObjectTypes(), '👽', '🍔']));
  const goalContainer = createElement({ cssClass: 'goal-input', text: 'Goal:' });
  goalInput = createElement({ tag: 'input' });
  goalInput.type = 'number';
  goalInput.min = MIN_GOAL;
  goalInput.max = MAX_GOAL;
  goalInput.addEventListener('blur', validateGoal);
  goalContainer.appendChild(goalInput);
  configScreen.appendChild(goalContainer);
  const closeButton = createElement({ cssClass: 'close-btn', text: 'Load game', onClick: closeConfigScreen });
  configScreen.appendChild(closeButton);
}

function createEmojiButtons(emojis, isToggle) {
  const buttonsContainer = createElement({ cssClass: 'button-container' });
  emojis.forEach((emoji) => {
    const btn = createElement({
      cssClass: 'emoji-btn',
      text: emoji,
      onClick: () => {
        if (isToggle && getConfigValue().includes(emoji)) {
          setConfigValue(getConfigValue().replace(emoji, ''));
        } else {
          setConfigValue(getConfigValue() + emoji);
        }
      },
    });
    buttonsContainer.appendChild(btn);
  });
  return buttonsContainer;
}

function createThemeButtons(themes) {
  const buttonsContainer = createElement({ cssClass: 'button-container' });
  themes.forEach(({ id, goal, config }) => {
    const btn = createElement({
      cssClass: 'theme-btn',
      text: id,
      onClick: () => {
        setConfigValue(config);
        goalInput.value = goal;
      },
    });
    buttonsContainer.appendChild(btn);
  });
  return buttonsContainer;
}

function getConfigValue() {
  return textarea.value;
}

function setConfigValue(value) {
  textarea.value = getSupportedLevelConfigArray(value).join('');
  textarea.focus();
}

function validateConfig() {
  setConfigValue(getConfigValue());
}

function validateGoal() {
  const goal = goalInput.value;
  if (goal < MIN_GOAL) {
    goalInput.value = MIN_GOAL;
  } else if (goal > MAX_GOAL) {
    goalInput.value = MAX_GOAL;
  }
}
