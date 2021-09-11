import { getStoredExpertMode } from '../store';
import { addBodyClasses } from '../utils';
import { initConfigScreen } from '../configScreen/configScreen';
import { isExpertMode, setExpertMode } from '../globals';

export function setupExpertMode() {
  if (getStoredExpertMode() && !isExpertMode()) {
    addBodyClasses('expert');
    initConfigScreen();
    setExpertMode();
  }
}
