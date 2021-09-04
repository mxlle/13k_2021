import { GameObject, ObjectType } from './gameObject';
import { getGoal, updateScoreboard } from './score';
import { Marker } from './marker';
import { ControlHandler } from './controlHandler';

const SPIN_TIME = 1000;
const CRASH_SAFETY_TIME = 2000;

export class Cat extends GameObject {
  crashSafety = false;
  _character;
  _random = true;
  _score = 0;
  _controls;
  _markers = {};

  constructor(properties) {
    super({ type: ObjectType.CAT, ...properties });

    const { character, leftKey, rightKey } = properties;

    this._character = character;

    this.setupMarkers();

    this._controls = new ControlHandler(this, leftKey, rightKey);
  }

  update() {
    super.update();

    // let bots turn randomly
    if (this._random && Math.random() < 0.02) {
      Math.random() < 0.5 ? this._controls.turnRight() : this._controls.turnLeft();
    }
  }

  start() {
    this._controls.startMoving();
  }

  stop() {
    this._controls.stopMoving();
    this.obj.opacity = 1;
  }

  controlManually() {
    if (this._random) {
      this._random = false;
      this._markers.human?.show();
      this.resetScore(); // when switching from bot to human, reset score
    }
  }

  speedUp() {
    this._controls.speedUp();
  }

  handleCrash(direction) {
    this.activateSafetyMode(CRASH_SAFETY_TIME);
    this.animationHandler
      .spinAround(SPIN_TIME, direction, 2)
      .then(() => {
        this._controls.startMoving(); // move in a random direction with default speed
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
    const keys = this._controls.getKeysString(this._random);
    return `<div class="result ${this._random ? 'bot' : 'human'}">
                ${keys}
                <span class="cat">${this._character}</span>
                <span>Score:&nbsp;${this._score}</span>
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

  hideAllMarkers() {
    this._markers.human?.hide();
    this._markers.trophy?.hide();
    this._markers.swap?.hide();
  }

  showAllMarkers() {
    if (this.isHuman()) this._markers.human?.show();
    if (this.hasWon()) this._markers.trophy?.show();
    else if (this._controls.areSwapped()) this._markers.swap?.show();
  }

  setupMarkers() {
    this._markers = {
      human: new Marker('🧑‍🚀', this, true), // todo sometimes not available
      trophy: new Marker('🏆️', this),
      swap: new Marker('💩️', this),
    };
  }
}
