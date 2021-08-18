import { Text, bindKeys } from '../../node_modules/kontra/kontra.mjs';
import { wormhole } from './wormhole.js';

export class Cat {
  id;
  obj;

  constructor(character, leftKey, rightKey, id) {
    this.id = id;

    this.obj = Text({
      text: character,
      font: '100px sans-serif',
      //anchor: { x: 0.5, y: 0.5 }
    });

    this.wormhole();

    bindKeys(leftKey, () => {
      this.turnLeft();
    });

    bindKeys(rightKey, () => {
      this.turnRight();
    });
  }

  wormhole() {
    wormhole(this.obj);
  }

  deceleratingWormhole() {
    this.wormhole();
    this.startMoving();
  }

  startMoving() {
    if (Math.random() < 0.5) {
      this.obj.dx = getStartVelocity();
      this.obj.dy = 0;
    } else {
      this.obj.dx = 0;
      this.obj.dy = getStartVelocity();
    }
  }

  move() {
    this.obj.update();
    wrapObjectOnEdge(this.obj);
  }

  turnLeft() {
    const obj = this.obj;
    const velocity = Math.abs(obj.dx) || Math.abs(obj.dy);
    if (obj.dx === 0) {
      obj.dx = obj.dy < 0 ? -1 * velocity : velocity;
      obj.dy = 0;
    } else {
      obj.dy = obj.dx < 0 ? velocity : -1 * velocity;
      obj.dx = 0;
    }
    //obj.rotation = Math.abs(obj.rotation - Math.PI/2);
  }

  turnRight() {
    const obj = this.obj;
    const velocity = Math.abs(obj.dx) || Math.abs(obj.dy);
    if (obj.dx === 0) {
      obj.dx = obj.dy < 0 ? velocity : -1 * velocity;
      obj.dy = 0;
    } else {
      obj.dy = obj.dx < 0 ? -1 * velocity : velocity;
      obj.dx = 0;
    }
    //obj.rotation = (obj.rotation + Math.PI/2) % (Math.PI*2);
  }

  turnAround() {
    this.turnLeft();
    this.turnLeft();
  }

  speedUp() {
    if (this.obj.dx === 0 && this.obj.dy === 0) {
      this.startMoving();
    } else if (this.obj.dx === 0) {
      this.obj.dy = this.obj.dy > 0 ? this.obj.dy + 1 : this.obj.dy - 1;
    } else {
      this.obj.dx = this.obj.dx > 0 ? this.obj.dx + 1 : this.obj.dx - 1;
    }
  }

  stop() {
    this.obj.dx = 0;
    this.obj.dy = 0;
  }
}

function getStartVelocity() {
  return Math.random() < 0.5 ? -3 : 3;
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
