import { GameObject } from './gameObject';
import { Marker } from './marker';
import { ControlHandler } from './handlers/controlHandler';
import { ObjectType } from '../config/objectType';

const SPIN_TIME = 1000;
const CRASH_SAFETY_TIME = 2000;

const MOVING_OBJECT_SCALE = 1.5;

export class MovingObject extends GameObject {
  isMovingObject = true;
  crashSafety = false;
  isBot = true;
  markers = {};
  controls;

  constructor(properties) {
    super({ type: ObjectType.MOVING, ...properties, size: properties.size * MOVING_OBJECT_SCALE });

    this.setupMarkers();

    this.controls = new ControlHandler(this);
    this.controls.startMoving();
  }

  update() {
    super.update();

    // let bots turn randomly
    if (this.isBot && Math.random() < 0.02) {
      Math.random() < 0.5 ? this.controls.turnRight() : this.controls.turnLeft();
    }
  }

  reset() {
    this.controls.reset();
    this.obj.opacity = 1;
  }

  speedUp() {
    this.controls.speedUp();
  }

  turnLeft(alreadySwapped) {
    this.controls.turnLeft(alreadySwapped);
  }

  turnRight(alreadySwapped) {
    this.controls.turnRight(alreadySwapped);
  }

  handleCrash(direction) {
    this.activateSafetyMode(CRASH_SAFETY_TIME);
    this.animationHandler
      .spinAround(SPIN_TIME, direction, 2)
      .then(() => {
        this.controls.startMoving(); // move in a random direction with default speed
      })
      .catch(() => {});
  }

  handleWormhole(wormhole) {
    wormhole.wormhole();
    this.wormhole();
  }

  confuse() {
    this.controls.swapControls();
  }

  activateSafetyMode(time) {
    this.crashSafety = true;
    this.obj.opacity = 0.6;
    setTimeout(() => {
      this.crashSafety = false;
      this.obj.opacity = 1;
    }, time);
  }

  setupMarkers() {
    this.markers = {
      human: new Marker('🧑‍🚀', this, true), // todo sometimes not available
      trophy: new Marker('🏆️', this),
      swap: new Marker('💩️', this),
    };
  }
}
