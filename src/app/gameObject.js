import { Text, randInt } from 'kontra';

let idGen = 0;

export const ObjectType = {
  CAT: '🐱',
  SYNTH: '🎹',
  ROCKET: '🚀',
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
      font: `${type === ObjectType.ROCKET ? 50 : 100}px sans-serif`,
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
}
