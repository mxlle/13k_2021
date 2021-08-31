import { bindKeys, randInt } from 'kontra';
import { GameObject, ObjectType } from './gameObject';
import { getGoal, updateScoreboard } from './score';
import { isGameStarted, SWAP_TIME } from './game';
import { deactivateClickMode } from '../index';
import { Marker } from './marker';

const SPIN_TIME = 1000;
const CRASH_SAFETY_TIME = 2000;

const DEFAULT_VELOCITY = 3;
const DIRECTIONS = [
  { x: 0, y: -1 }, // UP
  { x: 1, y: 0 }, /// RIGHT
  { x: 0, y: 1 }, /// DOWN
  { x: -1, y: 0 }, // LEFT
];

export class Cat extends GameObject {
  _character;
  _score = 0;
  _leftKey;
  _rightKey;
  _direction = 0;
  _velocity = 0;
  _humanMarker;
  _swapMarker;
  _trophyMarker;
  _random = true;
  _swappedControls = false;
  _swapTimeout;
  crashSafety = false;

  constructor(character, leftKey, rightKey, size) {
    super(ObjectType.CAT, size, character);

    this._character = character;

    this.setupMarkers();
    this.setupKeys(leftKey, rightKey);
  }

  controlManually() {
    if (this._random) {
      this._random = false;
      this._humanMarker.show();
      this.resetScore(); // when switching from bot to human, reset score
    }
  }

  startMoving(velocity) {
    this._velocity = velocity ?? DEFAULT_VELOCITY;
    this._direction = randInt(0, 3);
    this.onDirectionOrVelocityUpdate();
  }

  update() {
    super.update();

    // let bots turn randomly
    if (this._random && Math.random() < 0.02) {
      Math.random() < 0.5 ? this.turnRight() : this.turnLeft();
    }
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
    this.setDxDy(x * this._velocity, y * this._velocity);
  }

  speedUp() {
    this._velocity = Math.max(this._velocity + 1, DEFAULT_VELOCITY);
    this.onDirectionOrVelocityUpdate();
  }

  handleCrash(direction) {
    this.activateSafetyMode(CRASH_SAFETY_TIME);
    this.animationHandler
      .spinAround(SPIN_TIME, direction, 2)
      .then(() => {
        this.startMoving(); // move in a random direction with default speed
      })
      .catch(() => console.log('new crash'));
  }

  async handleWormhole(wormhole) {
    this.hideAllMarkers(); // better for animation // todo scale?
    wormhole.wormhole();
    this.wormhole().then(() => {
      this.showAllMarkers();
    });
  }

  activateSafetyMode(time) {
    this.crashSafety = true;
    this.obj.opacity = 0.6;
    setTimeout(() => {
      this.crashSafety = false;
      this.obj.opacity = 1;
    }, time);
  }

  swapControls() {
    this._swappedControls = true;
    this._swapMarker.show();
    updateScoreboard();

    clearTimeout(this._swapTimeout);

    this._swapTimeout = setTimeout(() => {
      this.restoreControls();
    }, SWAP_TIME);
  }

  restoreControls() {
    this._swapMarker.hide();
    this._swappedControls = false;
    this._swapTimeout = undefined;
    updateScoreboard();
  }

  stop() {
    this._velocity = 0;
    this.onDirectionOrVelocityUpdate();
    clearTimeout(this._swapTimeout);
    this.restoreControls();
    this.obj.opacity = 1;
  }

  incScore() {
    this._score++;
    updateScoreboard();
  }

  resetScore() {
    this._score = 0;
    this._trophyMarker.hide();
    updateScoreboard();
  }

  getScoreOutput() {
    let keys = '';
    if (this._leftKey && this._rightKey) {
      if (!this._swappedControls || this._random) {
        keys = `<span class="keys">[${this._leftKey}]&nbsp;[${this._rightKey}]</span>`;
      } else {
        keys = `<span class="keys swapped">[${this._rightKey}]&nbsp;[${this._leftKey}]</span>`;
      }
    }
    return `<div class="result ${this._random ? 'bot' : 'human'}">
                ${keys}
                <span class="cat">${this._character}</span>
                <span>Score:&nbsp;${this._score}</span>
            </div>`;
  }

  hasWon() {
    const hasWon = this._score >= getGoal();
    if (hasWon) this._trophyMarker.show();
    return hasWon;
  }

  isHuman() {
    return !this._random;
  }

  hideAllMarkers() {
    this._humanMarker.hide();
    this._swapMarker.hide();
    this._trophyMarker.hide();
  }

  showAllMarkers() {
    if (this.isHuman()) this._humanMarker.show();
    if (this.hasWon()) this._trophyMarker.show();
    else if (this._swappedControls) this._swapMarker.show();
  }

  setupMarkers() {
    this._humanMarker = new Marker('🧑‍🚀', this, true);
    this._swapMarker = new Marker('💩️', this);
    this._trophyMarker = new Marker('🏆️', this);
  }

  setupKeys(leftKey, rightKey) {
    if (!leftKey || !rightKey) return;

    bindKeys(leftKey, () => {
      if (!isGameStarted()) return;
      deactivateClickMode();
      this.controlManually();
      this.turnLeft();
    });

    bindKeys(rightKey, () => {
      if (!isGameStarted()) return;
      deactivateClickMode();
      this.controlManually();
      this.turnRight();
    });

    this._leftKey = leftKey === 'left' ? '&larr;' : leftKey.toUpperCase();
    this._rightKey = rightKey === 'right' ? '&rarr;' : rightKey.toUpperCase();
  }
}
