import './hints.scss';

import { createElement } from '../utils';
import { CUSTOM_LEVEL_ID, getCurrentLevel, isExpertMode, isGameEnded, isPreparationMode } from '../globals';

let hintContainer, startHint, continueHint, goalHint, expertConfigHint, bonusLevel, youWon, youLost;

export function initHints() {
  hintContainer = createElement({ cssClass: 'hints' });
  document.body.appendChild(hintContainer);
  // hint texts
  startHint = createElement({ text: 'Hit SPACE to start the adventure.' });
  continueHint = createElement({ text: 'Hit SPACE to continue.' });
  goalHint = createElement({ text: 'Bring your cat to a synthesizer.' });
  youWon = createElement({ text: 'You won!' });
  youLost = createElement({ text: 'You lost!' });
  expertConfigHint = createElement({ text: 'Hit ENTER to build your own adventure.', cssClass: 'secondary-hint' });
  bonusLevel = createElement({ text: 'Bonus adventure!', cssClass: 'bonus-level-hint' });
}

export function updateHints(hasWon) {
  hintContainer.innerHTML = '';
  if (isPreparationMode()) {
    if (isExpertMode()) {
      if (getCurrentLevel() === CUSTOM_LEVEL_ID) {
        hintContainer.appendChild(bonusLevel);
      }
      hintContainer.appendChild(expertConfigHint);
    }
    hintContainer.appendChild(startHint);
  } else if (isGameEnded()) {
    hintContainer.appendChild(hasWon ? youWon : youLost);
    hintContainer.appendChild(continueHint);
  } else {
    hintContainer.appendChild(goalHint);
  }
}
