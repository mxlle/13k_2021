import { getStoredExportMode } from '../store';
import { addBodyClasses } from '../utils';
import { initConfigScreen } from '../configScreen/configScreen';
import { isExpertMode, setExpertMode } from '../globals';

export function setupExpertMode() {
  if (getStoredExportMode() && !isExpertMode()) {
    addBodyClasses('expert');
    initConfigScreen();
    setExpertMode();
  }
}
