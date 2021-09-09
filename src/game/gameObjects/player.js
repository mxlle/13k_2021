import { GameObject, ObjectType } from './gameObject';
import { getGoal, updateScoreboard } from '../score/score';
import { Marker } from './marker';
import { ControlHandler } from './handlers/controlHandler';

const SPIN_TIME = 1000;
const CRASH_SAFETY_TIME = 2000;

const PLAYER_SCALE = 1.5;

export class Player extends GameObject {
  crashSafety = false;
  _random = true;
  _score = 0;
  _controls;
  _markers = {};

  constructor(properties) {
    super({ type: ObjectType.PLAYER, ...properties, size: properties.size * PLAYER_SCALE });

    const { leftKey, rightKey } = properties;

    this.setupMarkers();

    this._controls = new ControlHandler(this, leftKey, rightKey);
    this._controls.startMoving();
  }

  update() {
    super.update();

    // let bots turn randomly
    if (this.isBot() && Math.random() < 0.02) {
      Math.random() < 0.5 ? this._controls.turnRight() : this._controls.turnLeft();
    }
  }

  reset() {
    this._controls.reset();
    this.obj.opacity = 1;
  }

  controlManually() {
    if (this.isBot()) {
      this._random = false;
      this._markers.human?.show();
      this.resetScore(); // when switching from bot to human, reset score
    }
  }

  speedUp() {
    this._controls.speedUp();
  }

  turnLeft() {
    this._controls.turnLeft();
  }

  turnRight() {
    this._controls.turnRight();
  }

  handleCrash(direction) {
    this.activateSafetyMode(CRASH_SAFETY_TIME);
    this.animationHandler
      .spinAround(SPIN_TIME, direction, 2)
      .then(() => {
        this._controls.startMoving(); // move in a random direction with default speed
      })
      .catch(() => {});
  }

  handleWormhole(wormhole) {
    wormhole.wormhole();
    this.wormhole();
  }

  confuse() {
    this._controls.swapControls();
  }

  activateSafetyMode(time) {
    this.crashSafety = true;
    this.obj.opacity = 0.6;
    setTimeout(() => {
      this.crashSafety = false;
      this.obj.opacity = 1;
    }, time);
  }

  incScore() {
    this._score++;
    updateScoreboard();
  }

  resetScore() {
    this._score = 0;
    this._markers.trophy?.hide();
    updateScoreboard();
  }

  getScoreOutput() {
    const score = getGoal() <= 9 || this._score > 9 ? this._score : '0' + this._score;
    const keys = this._controls.getKeysString(this._random);
    return `<div class="result ${this.isBot() ? 'bot' : 'human'}">
                ${keys}
                <span class="player">${this.emoji}</span>
                <span>Score:&nbsp;${score}</span>
            </div>`;
  }

  hasWon() {
    const hasWon = this._score >= getGoal();
    if (hasWon) this._markers.trophy?.show();
    return hasWon;
  }

  isHuman() {
    return !this._random;
  }

  isBot() {
    return this._random;
  }

  setupMarkers() {
    this._markers = {
      human: new Marker('🧑‍🚀', this, true), // todo sometimes not available
      trophy: new Marker('🏆️', this),
      swap: new Marker('💩️', this),
    };
  }
}
