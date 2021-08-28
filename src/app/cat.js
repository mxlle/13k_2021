import { bindKeys, randInt, Text } from 'kontra';
import { GameObject, ObjectType } from './gameObject';
import { GOAL } from './score';
import { SWAP_TIME } from './game';
import { deactivateClickMode } from '../index';

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
  _direction;
  _velocity;
  _swapMarker;
  _trophyMarker;
  _random = true;
  _swappedControls = false;
  _swapTimeout;

  constructor(character, leftKey, rightKey) {
    super(ObjectType.CAT, character);

    this._character = character;

    this._swapMarker = new Text({ text: '↔️', font: '30px sans-serif', x: this.obj.width - 30 });
    this._trophyMarker = new Text({ text: '🏆️', font: '30px sans-serif', x: this.obj.width - 30 });
    this.obj.children.push(this._swapMarker, this._trophyMarker);
    this._swapMarker.opacity = 0;
    this._trophyMarker.opacity = 0;

    bindKeys(leftKey, () => {
      deactivateClickMode();
      this.controlManually();
      this.turnLeft();
    });

    bindKeys(rightKey, () => {
      deactivateClickMode();
      this.controlManually();
      this.turnRight();
    });

    this._leftKey = leftKey === 'left' ? '&larr;' : leftKey.toUpperCase();
    this._rightKey = rightKey === 'right' ? '&rarr;' : rightKey.toUpperCase();

    this.startMoving();
  }

  controlManually() {
    this._random = false;
  }

  deceleratingWormhole() {
    this.wormhole();
    this.startMoving();
  }

  startMoving() {
    this._velocity = DEFAULT_VELOCITY;
    this._direction = randInt(0, 3);
    this.onDirectionOrVelocityUpdate();
  }

  move() {
    this.obj.update();
    wrapObjectOnEdge(this.obj);

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
    this.obj.dx = x * this._velocity;
    this.obj.dy = y * this._velocity;
  }

  speedUp() {
    this._velocity = Math.max(this._velocity++, DEFAULT_VELOCITY);
    this.onDirectionOrVelocityUpdate();
  }

  swapControls() {
    this._swappedControls = true;
    this._swapMarker.opacity = 1;

    if (this._swapTimeout) clearTimeout(this._swapTimeout);

    this._swapTimeout = setTimeout(() => {
      this._swapMarker.opacity = 0;
      this._swappedControls = false;
      this._swapTimeout = undefined;
    }, SWAP_TIME);
  }

  stop() {
    this._velocity = 0;
    this.onDirectionOrVelocityUpdate();
    this._random = true;
    this._swapMarker.opacity = 0;
  }

  incScore() {
    this._score++;
    return this._score === GOAL;
  }

  resetScore() {
    this._score = 0;
    this._trophyMarker.opacity = 0;
  }

  getScoreOutput() {
    return `${this._character}&nbsp;[${this._leftKey}]&nbsp;[${this._rightKey}]&nbsp;Score:&nbsp;${this._score}`;
  }

  hasWon() {
    const hasWon = this._score >= GOAL;
    if (hasWon) this._trophyMarker.opacity = 1;
    return hasWon;
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
