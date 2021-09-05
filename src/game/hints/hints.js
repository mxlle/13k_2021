import './hints.scss';

import { getCurrentLevel, isGameEnded, isPreparationMode } from '../game';
import { createElement } from '../utils';
import { isExpertMode } from '../../index';

let hintContainer, startHint, continueHint, goalHint, expertHint, expertState, bonusLevel, youWon, youLost;

export function initHints() {
  hintContainer = createElement({ cssClass: 'hints' });
  document.body.appendChild(hintContainer);
  // hint texts
  startHint = createElement({ text: 'Hit SPACE to start.' });
  continueHint = createElement({ text: 'Hit SPACE to continue.' });
  goalHint = createElement({ text: 'Bring your cat to a synthesizer.' });
  youWon = createElement({ text: 'You won!' });
  youLost = createElement({ text: 'You lost!' });
  expertHint = createElement({ text: 'Press 1-9 to choose your level of chaos.', cssClass: 'expertHint' });
  expertState = createElement({ text: 'Wow! You are an expert.', cssClass: 'expertHint' });
  bonusLevel = createElement({ text: 'Bonus level!', cssClass: 'bonusLevelHint' });
}

export function updateHints(hasWon) {
  hintContainer.innerHTML = '';
  if (isPreparationMode()) {
    if (isExpertMode()) {
      hintContainer.appendChild(getCurrentLevel() === 13 ? bonusLevel : expertState);
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
