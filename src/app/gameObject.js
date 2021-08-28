import { Text, randInt, Sprite } from 'kontra';

let idGen = 0;

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

  constructor(type, size, character) {
    this.id = idGen++;
    this.type = type;

    this.defaultSize = size;
    this.size = size;

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

    this.setFontSize(size);

    this.collisionDetector.children.push(this.obj);

    this.wormhole();
  }

  render() {
    this.collisionDetector.render();
  }

  update() {
    this.collisionDetector.update();
  }

  isCat() {
    return this.type === ObjectType.CAT;
  }

  wormhole() {
    this.collisionDetector.x = randInt(0, window.innerWidth - this.collisionDetector.width);
    this.collisionDetector.y = randInt(0, window.innerHeight - this.collisionDetector.height);
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

  changeSize(dir) {
    this.size = Math.min(Math.max(this.size + dir, this.defaultSize / 10), this.defaultSize);
    this.setFontSize(this.size);
  }

  setFontSize(size) {
    this.obj.font = `${size}px sans-serif`;
  }
}
