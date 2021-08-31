import { Text, randInt, Sprite } from 'kontra';
import { AnimationHandler } from './animationHandler';

let idGen = 0;

const PRE_WORMHOLE_TIME = 500;
const PRE_WORMHOLE_TIME_OBJ = 250;
const POST_WORMHOLE_TIME = 500;

export const ObjectType = {
  CAT: '🐱',
  SYNTH: '🎹',
  ROCKET: '🚀',
  WORMHOLE: '💥',
  SHUFFLE: '🎲',
  ATTACK: '🔫',
  TRAP: '💩',
  DEATH: '☠️',
};

export const ObjectSize = {
  SMALL: 50,
  MEDIUM: 60,
  LARGE: 70,
  XL: 100,
};

export class GameObject {
  id;
  collisionDetector;
  obj;
  type;
  defaultSize;
  size;
  canCollide = true;
  animationHandler;

  constructor(type, size, character) {
    this.id = idGen++;
    this.type = type;

    this.defaultSize = size;

    this.collisionDetector = new Sprite({
      width: size,
      height: size,
      //color: 'blue',
    });

    this.obj = Text({
      text: character || type,
      anchor: { x: 0.5, y: 0.5 },
      x: size / 2,
      y: size / 2,
    });

    this.setSize(size);

    this.collisionDetector.children.push(this.obj);

    this.animationHandler = new AnimationHandler(this.obj, this.defaultSize);

    this.moveToRandomPlace();
  }

  render() {
    this.collisionDetector.render();
  }

  update() {
    // handle rotation
    const rotation = this.animationHandler.getRotation();
    if (rotation !== null) {
      this.obj.rotation = rotation;
    }

    // handle size animation
    this.setSize(this.animationHandler.getSize() ?? this.defaultSize);

    // continue moving object if not rotating or during inner bit of shrinking/growing (with threshold)
    if (this.isCat() && rotation === null && this.size / this.defaultSize > 0.5) {
      this.collisionDetector.update();
      wrapObjectOnEdge(this.collisionDetector);
    }
  }

  isCat() {
    return this.type === ObjectType.CAT;
  }

  moveToRandomPlace() {
    this.collisionDetector.x = randInt(0, window.innerWidth - this.collisionDetector.width);
    this.collisionDetector.y = randInt(0, window.innerHeight - this.collisionDetector.height);
  }

  wormhole() {
    this.canCollide = false;
    return this.animationHandler
      .shrink(this.isCat() ? PRE_WORMHOLE_TIME : PRE_WORMHOLE_TIME_OBJ)
      .then(() => {
        this.setSize(0);
        this.moveToRandomPlace();
        return this.animationHandler.grow(POST_WORMHOLE_TIME).then(() => (this.canCollide = true));
      })
      .catch(() => console.log('new size animation'));
  }

  hide() {
    this.collisionDetector.x = -1000;
    this.collisionDetector.y = -1000;
  }

  hideForTime(timeout) {
    this.hide();
    setTimeout(() => {
      this.wormhole();
    }, timeout);
  }

  setDxDy(dx, dy) {
    this.collisionDetector.dx = dx;
    this.collisionDetector.dy = dy;
  }

  setSize(size) {
    if (this.size !== size) {
      this.size = size;
      this.obj.font = `${size}px sans-serif`;
    }
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
