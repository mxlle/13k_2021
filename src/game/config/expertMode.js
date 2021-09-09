import { getStoredExportMode } from '../store';
import { addBodyClasses } from '../utils';
import { bindKeys } from 'kontra';
import { getAvailableLevelsAsString } from './gameSetup';
import { configureIsShown, initConfigScreen } from '../configScreen/configScreen';
import { CUSTOM_LEVEL_ID, expertMode, isPreparationMode, loadGame, setExpertMode } from '../globals';

export function setupExpertMode() {
  if (getStoredExportMode() && !expertMode) {
    addBodyClasses('expert');
    bindKeys(getAvailableLevelsAsString().concat('0'), (event) => {
      if (isPreparationMode() && !configureIsShown()) {
        const level = event.key === '0' ? CUSTOM_LEVEL_ID : event.key;
        loadGame(level);
      }
    });
    initConfigScreen();
    setExpertMode();
  }
}
