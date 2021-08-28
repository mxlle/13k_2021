import { bindKeys, randInt, Text } from 'kontra';
import { GameObject, ObjectType } from './gameObject';
import { getGoal, updateScoreboard } from './score';
import { isGameStarted, SWAP_TIME } from './game';
import { deactivateClickMode } from '../index';

const SPIN_TIME = 1000;
const CRASH_SAFETY_TIME = 2000;
const WORMHOLE_TIME = 1000;

const ANIMATION_FRAME_DISTANCE = 5;

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
  _crashTimeout;
  _activeRotation = 0;
  _rotationFrameCount = 0;
  _activeWormhole = 0;

  constructor(character, leftKey, rightKey, size) {
    super(ObjectType.CAT, size, character);

    this._character = character;

    this.setupMarkers();
    this.setupKeys(leftKey, rightKey);
  }

  controlManually() {
    if (this._random) {
      this._random = false;
      this._humanMarker.opacity = 1;
      this.resetScore(); // when switching from bot to human, reset score
    }
  }

  startMoving() {
    this._velocity = DEFAULT_VELOCITY;
    this._direction = randInt(0, 3);
    this.onDirectionOrVelocityUpdate();
  }

  update() {
    let continueMoving = true;
    if (this._activeRotation) continueMoving = this.handleSpinningMove();
    if (this._activeWormhole) continueMoving = this.handleWormholeMove();

    if (!continueMoving) return;

    super.update();
    wrapObjectOnEdge(this.collisionDetector);

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
    this.startSpinning(direction);
    this.activateSafetyMode(CRASH_SAFETY_TIME);
    clearTimeout(this._crashTimeout);
    this._crashTimeout = setTimeout(() => {
      this.stopSpinning();
      this.startMoving();
      this._crashTimeout = undefined;
    }, SPIN_TIME);
  }

  startSpinning(direction) {
    this._activeRotation = direction || 1;
  }

  stopSpinning() {
    this._activeRotation = 0;
    this._rotationFrameCount = 0;
    this.obj.rotation = 0;
  }

  handleSpinningMove() {
    this._rotationFrameCount++;
    if (this._rotationFrameCount % ANIMATION_FRAME_DISTANCE === 0) {
      const turnsPerSec = isGameStarted() ? 2 : 0.5;
      const divider = 60 / turnsPerSec;
      this.obj.rotation = this.obj.rotation + ANIMATION_FRAME_DISTANCE * ((this._activeRotation * (2 * Math.PI)) / divider);
    }
    return false;
  }

  handleWormhole(wormhole) {
    wormhole.canCollide = false;
    this.hideAllMarkers();
    // start shrinking
    this._activeWormhole = -1;

    setTimeout(() => {
      // actual wormhole jump
      this.wormhole();
      wormhole.wormhole();
      wormhole.canCollide = true;
      // start growing
      this._activeWormhole = 1;
    }, WORMHOLE_TIME / 2);

    setTimeout(() => {
      // restore size
      this._activeWormhole = 0;
      this.setFontSize(this.defaultSize);
      this.showAllMarkers();
    }, WORMHOLE_TIME);
  }

  handleWormholeMove() {
    if (this._activeWormhole < 0) {
      this._activeWormhole--;
      if (this._activeWormhole % ANIMATION_FRAME_DISTANCE === 0) this.changeSize((1000 / WORMHOLE_TIME) * -2 * ANIMATION_FRAME_DISTANCE);
      return this._activeWormhole > (-1 * this.size) / 3 + this._velocity;
    } else {
      this._activeWormhole++;
      if (this._activeWormhole % ANIMATION_FRAME_DISTANCE === 0) this.changeSize((1000 / WORMHOLE_TIME) * 2 * ANIMATION_FRAME_DISTANCE);
    }
    return false;
  }

  activateSafetyMode(time) {
    this.canCollide = false;
    this.obj.opacity = 0.6;
    setTimeout(() => {
      this.canCollide = true;
      this.obj.opacity = 1;
    }, time);
  }

  swapControls() {
    this._swappedControls = true;
    this._swapMarker.opacity = 1;

    clearTimeout(this._swapTimeout);

    this._swapTimeout = setTimeout(() => {
      this.restoreControls();
    }, SWAP_TIME);
  }

  restoreControls() {
    this._swapMarker.opacity = 0;
    this._swappedControls = false;
    this._swapTimeout = undefined;
  }

  stop() {
    this._velocity = 0;
    this.onDirectionOrVelocityUpdate();
    clearTimeout(this._swapTimeout);
    clearTimeout(this._crashTimeout);
    this.restoreControls();
    this.obj.opacity = 1;
  }

  incScore() {
    this._score++;
    updateScoreboard();
  }

  resetScore() {
    this._score = 0;
    this._trophyMarker.opacity = 0;
    updateScoreboard();
  }

  getScoreOutput() {
    let keys = '';
    if (this._leftKey && this._rightKey) {
      keys = `<span class="keys">[${this._leftKey}]&nbsp;[${this._rightKey}]</span>`;
    }
    return `<div class="result ${this._random ? 'bot' : 'human'}">
                ${keys}
                <span class="cat">${this._character}</span>
                <span>Score:&nbsp;${this._score}</span>
            </div>`;
  }

  hasWon() {
    const hasWon = this._score >= getGoal();
    if (hasWon) this._trophyMarker.opacity = 1;
    return hasWon;
  }

  isHuman() {
    return !this._random;
  }

  hideAllMarkers() {
    this._humanMarker.opacity = 0;
    this._swapMarker.opacity = 0;
    this._trophyMarker.opacity = 0;
  }

  showAllMarkers() {
    if (this.isHuman()) this._humanMarker.opacity = 1;
    if (this.hasWon()) this._trophyMarker.opacity = 1;
    else if (this._swappedControls) this._swapMarker.opacity = 1;
  }

  setupMarkers() {
    const markerSize = this.defaultSize / 3;
    const markerFont = `${markerSize}px sans-serif`;
    const margin = markerSize / 3;

    const bottomLeft = {
      font: markerFont,
      x: -(this.size / 2 + margin),
      y: this.size / 2 - markerSize + margin,
    };

    const rightTop = {
      font: markerFont,
      x: this.size / 2 - markerSize + margin,
      y: -(this.size / 2 + margin),
    };

    this._humanMarker = new Text({ text: '🧑‍🚀', ...bottomLeft });
    this._swapMarker = new Text({ text: '↔️', ...rightTop });
    this._trophyMarker = new Text({ text: '🏆️', ...rightTop });
    this.obj.children.push(this._humanMarker, this._swapMarker, this._trophyMarker);
    this._humanMarker.opacity = 0;
    this._swapMarker.opacity = 0;
    this._trophyMarker.opacity = 0;
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

function wrapObjectOnEdge(obj) {
  if (obj.x > window.innerWidth) {
    obj.x = -obj.width;
  }
  if (obj.x < -obj.width) {
    obj.x = window.innerWidth;
  }
  if (obj.y > window.innerHeight) {
    obj.y = -obj.height;
  }
  if (obj.y < -obj.height) {
    obj.y = window.innerHeight;
  }
}
