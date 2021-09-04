import { randInt, Sprite } from 'kontra';

let idGen = 0;

export class CollisionDetector extends Sprite.class {
  id;
  defaultSize;
  canCollide = true;

  constructor(properties) {
    super({
      height: properties.size,
      width: properties.size,
      // color: 'blue',
    });

    this.id = idGen++;
    this.defaultSize = properties.size;
  }

  update(dt) {
    super.update();

    // wrap object on window edge
    if (this.x > window.innerWidth) {
      this.x = -this.width;
    }
    if (this.x < -this.width) {
      this.x = window.innerWidth;
    }
    if (this.y > window.innerHeight) {
      this.y = -this.height;
    }
    if (this.y < -this.height) {
      this.y = window.innerHeight;
    }
  }

  moveToRandomPlace() {
    this.x = randInt(0, window.innerWidth - this.width);
    this.y = randInt(0, window.innerHeight - this.height);
  }

  hide() {
    this.x = -1000;
    this.y = -1000;
  }

  hideForTime(timeout) {
    this.hide();
    setTimeout(() => {
      this.wormhole();
    }, timeout);
  }
}
