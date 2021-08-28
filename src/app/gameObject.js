import { Text, randInt } from 'kontra';

let idGen = 0;

export const ObjectType = {
  CAT: '🐱',
  SYNTH: '🎹',
  ROCKET: '🚀',
  WORMHOLE: '💥',
  DIE: '🎲',
  ATTACK: '🔫',
  TRAP: '💩',
  DEATH: '☠️',
};

export class GameObject {
  id;
  obj;
  type;

  constructor(type, character) {
    this.id = idGen++;
    this.type = type;

    this.obj = Text({
      text: character || type,
      font: `${type === ObjectType.CAT ? 75 : 50}px sans-serif`,
      //anchor: { x: 0.5, y: 0.5 }
    });

    this.wormhole();
  }

  isCat() {
    return this.type === ObjectType.CAT;
  }

  wormhole() {
    this.obj.x = randInt(0, window.innerWidth - this.obj.width);
    this.obj.y = randInt(0, window.innerHeight - this.obj.height);
  }

  hide() {
    this.obj.x = -1000;
    this.obj.y = -1000;
  }

  hideForTime(timeout) {
    this.hide();
    setTimeout(() => {
      this.wormhole();
    }, timeout);
  }
}
