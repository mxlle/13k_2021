import { bindKeys, randInt } from 'kontra';
import { isGameStarted, SWAP_TIME } from './game';
import { deactivateClickMode } from '../index';
import { updateScoreboard } from './score';

const DEFAULT_VELOCITY = 3;
const DIRECTIONS = [
  { x: 0, y: -1 }, // UP
  { x: 1, y: 0 }, /// RIGHT
  { x: 0, y: 1 }, /// DOWN
  { x: -1, y: 0 }, // LEFT
];

export class ControlHandler {
  _cat;
  _leftKey;
  _rightKey;
  _direction = 0;
  _velocity = 0;
  _swappedControls = false;
  _swapTimeout;

  constructor(cat, leftKey, rightKey) {
    this._cat = cat;
    this.setupKeys(leftKey, rightKey);

    // setup click handler for the cat with the left and right key
    if (leftKey === 'left') {
      this.setupClickHandler();
    }
  }

  startMoving(velocity) {
    this._velocity = velocity ?? DEFAULT_VELOCITY;
    this._direction = randInt(0, 3);
    this.onDirectionOrVelocityUpdate();
  }

  stopMoving() {
    this._velocity = 0;
    this.onDirectionOrVelocityUpdate();
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
    this._cat.dx = x * this._velocity;
    this._cat.dy = y * this._velocity;
  }

  speedUp() {
    this._velocity = Math.max(this._velocity + 1, DEFAULT_VELOCITY);
    this.onDirectionOrVelocityUpdate();
  }

  swapControls() {
    this._swappedControls = true;
    this._cat._markers.swap?.show();
    updateScoreboard();

    clearTimeout(this._swapTimeout);

    this._swapTimeout = setTimeout(() => {
      this.restoreControls();
    }, SWAP_TIME);
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
    this._cat._markers.swap?.hide();
    this._swappedControls = false;
    this._swapTimeout = undefined;
    updateScoreboard();
  }

  setupKeys(leftKey, rightKey) {
    if (!leftKey || !rightKey) return;

    bindKeys(leftKey, () => {
      if (!isGameStarted()) return;
      deactivateClickMode();
      this._cat.controlManually();
      this.turnLeft();
    });

    bindKeys(rightKey, () => {
      if (!isGameStarted()) return;
      deactivateClickMode();
      this._cat.controlManually();
      this.turnRight();
    });

    this._leftKey = leftKey === 'left' ? '&larr;' : leftKey.toUpperCase();
    this._rightKey = rightKey === 'right' ? '&rarr;' : rightKey.toUpperCase();
  }

  setupClickHandler() {
    document.addEventListener('click', (event) => {
      this._cat.controlManually();

      if (event.target.id === 'left') {
        this.turnLeft();
      }
      if (event.target.id === 'right') {
        this.turnRight();
      }
    });
  }

  areSwapped() {
    return this._swappedControls;
  }
}
