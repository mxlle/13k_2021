import { bindKeys, randInt } from 'kontra';
import { updateScoreboard } from '../../score/score';
import { registerPlayerForScreenControls } from '../../screenControls/screenControls';
import { deactivateClickMode, FPS, isGameStarted, TRAP_TIME } from '../../globals';
import { addBodyClasses, removeBodyClasses } from '../../utils';

const CONTROLS_SWAPPED_CLASS = 'screen-controls-swapped';

const DIRECTIONS = [
  { x: 0, y: -1 }, // UP
  { x: 1, y: 0 }, /// RIGHT
  { x: 0, y: 1 }, /// DOWN
  { x: -1, y: 0 }, // LEFT
];

function getDefaultVelocity() {
  return 180 / FPS; // 180px/s
}

function getVelocityIncrease() {
  return 60 / FPS; // +60px/s
}

export class ControlHandler {
  _player;
  _leftKey;
  _rightKey;
  _direction = 0;
  _velocity = 0;
  _swappedControls = false;
  _swapTimeout;
  _withScreenControls = false;
  _baseRotation = 0;

  constructor(player) {
    this._player = player;
    this.startMoving();
  }

  startMoving() {
    this._velocity = getDefaultVelocity();
    this._direction = randInt(0, 3);
    this.onDirectionOrVelocityUpdate();
  }

  reset() {
    clearTimeout(this._swapTimeout);
    this.restoreControls();
  }

  turnLeft(alreadySwapped) {
    if (this._swappedControls && !alreadySwapped) {
      this.turnRight(true);
    } else {
      // actually turn left
      this._direction = (this._direction + 3) % 4;
      this.onDirectionOrVelocityUpdate();
    }
  }

  turnRight(alreadySwapped) {
    if (this._swappedControls && !alreadySwapped) {
      this.turnLeft(true);
    } else {
      // actually turn right
      this._direction = (this._direction + 1) % 4;
      this.onDirectionOrVelocityUpdate();
    }
  }

  onDirectionOrVelocityUpdate() {
    const { x, y } = DIRECTIONS[this._direction];
    this._player.dx = x * this._velocity;
    this._player.dy = y * this._velocity;
    this._baseRotation = (this._direction + 2) * (Math.PI / 2); // chin/bottom will point in move direction
  }

  speedUp() {
    this._velocity = Math.max(this._velocity + getVelocityIncrease(), getDefaultVelocity());
    this.onDirectionOrVelocityUpdate();
  }

  swapControls() {
    this._swappedControls = true;
    this._player.markers.swap?.show();
    updateScoreboard();
    if (this._withScreenControls) {
      addBodyClasses(CONTROLS_SWAPPED_CLASS);
    }

    clearTimeout(this._swapTimeout);

    this._swapTimeout = setTimeout(() => {
      this.restoreControls();
    }, TRAP_TIME);
  }

  getBaseRotation() {
    return this._baseRotation;
  }

  getKeysString(isRandom) {
    if (this._leftKey && this._rightKey) {
      if (!this._swappedControls || isRandom) {
        return `<span class="keys">[${this._leftKey}]&nbsp;[${this._rightKey}]</span>`;
      } else {
        return `<span class="keys swapped">[${this._rightKey}]&nbsp;[${this._leftKey}]</span>`;
      }
    }
  }

  restoreControls() {
    this._player.markers.swap?.hide();
    this._swappedControls = false;
    this._swapTimeout = undefined;
    updateScoreboard();
    if (this._withScreenControls) {
      removeBodyClasses(CONTROLS_SWAPPED_CLASS);
    }
  }

  setupKeys(leftKey, rightKey) {
    if (!leftKey || !rightKey) return;

    bindKeys(leftKey, () => {
      if (!isGameStarted()) return;
      deactivateClickMode();
      this._player.controlManually();
      this.turnLeft();
    });

    bindKeys(rightKey, () => {
      if (!isGameStarted()) return;
      deactivateClickMode();
      this._player.controlManually();
      this.turnRight();
    });

    this._leftKey = leftKey === 'left' ? '&larr;' : leftKey.toUpperCase();
    this._rightKey = rightKey === 'right' ? '&rarr;' : rightKey.toUpperCase();

    // setup click handler for the player with the left and right key
    if (leftKey === 'left') {
      this._withScreenControls = true;
      registerPlayerForScreenControls(this._player);
    }
  }
}
