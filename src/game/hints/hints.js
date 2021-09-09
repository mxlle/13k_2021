import './hints.scss';

import { getCurrentLevel, isGameEnded, isPreparationMode } from '../game';
import { createElement } from '../utils';
import { isExpertMode } from '../../index';
import { CUSTOM_LEVEL_ID } from '../config/levelConfig';

let hintContainer, startHint, continueHint, goalHint, expertHint, expertState, expertConfigHint, bonusLevel, youWon, youLost;

export function initHints() {
  hintContainer = createElement({ cssClass: 'hints' });
  document.body.appendChild(hintContainer);
  // hint texts
  startHint = createElement({ text: 'Hit SPACE to start you adventure.' });
  continueHint = createElement({ text: 'Hit SPACE to continue.' });
  goalHint = createElement({ text: 'Bring your cat to a synthesizer.' });
  youWon = createElement({ text: 'You won!' });
  youLost = createElement({ text: 'You lost!' });
  expertHint = createElement({ text: 'Press 1-9 to choose your level of chaos.', cssClass: 'expert-hint' });
  expertState = createElement({ text: 'Wow! You are an expert.', cssClass: 'expert-state' });
  expertConfigHint = createElement({ text: 'Press ENTER to configure.', cssClass: 'expert-hint' });
  bonusLevel = createElement({ text: 'Bonus level!', cssClass: 'bonus-level-hint' });
}

export function updateHints(hasWon) {
  hintContainer.innerHTML = '';
  if (isPreparationMode()) {
    if (isExpertMode()) {
      if (getCurrentLevel() === CUSTOM_LEVEL_ID) {
        hintContainer.appendChild(bonusLevel);
      } else {
        hintContainer.appendChild(expertState);
      }
      hintContainer.appendChild(expertConfigHint);
      hintContainer.appendChild(expertHint);
    }
    hintContainer.appendChild(goalHint);
    hintContainer.appendChild(startHint);
  } else if (isGameEnded()) {
    hintContainer.appendChild(hasWon ? youWon : youLost);
    hintContainer.appendChild(continueHint);
  } else {
    hintContainer.appendChild(goalHint);
  }
}
