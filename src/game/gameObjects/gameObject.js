import { Text } from 'kontra';
import { AnimationHandler } from './handlers/animationHandler';
import { CollisionDetector } from './collisionDetector';

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

export class GameObject extends CollisionDetector {
  obj;
  type;
  animationHandler;
  oneTime;

  constructor(properties) {
    super(properties);

    const { type, character, size } = properties;

    this.type = type;

    this.obj = Text({
      text: character || type,
      anchor: { x: 0.5, y: 0.5 },
      font: `${size}px sans-serif`,
      x: size / 2,
      y: size / 2,
    });

    this.children.push(this.obj);

    this.animationHandler = new AnimationHandler(this.obj, size);

    this.moveToRandomPlace();
  }

  update() {
    // handle rotation
    const rotation = this.animationHandler.getRotation();
    if (rotation !== null) {
      this.obj.rotation = rotation;
    }

    // handle size animation
    const scale = this.animationHandler.getScale() ?? 1;
    this.obj.setScale(scale, scale);

    // continue moving object if not rotating or during inner bit of shrinking/growing (with threshold)
    if (this.isCat() && rotation === null && scale > 0.5) {
      super.update();
    }
  }

  isCat() {
    return this.type === ObjectType.CAT;
  }

  wormhole() {
    this.canCollide = false;
    return this.animationHandler
      .shrink(this.isCat() ? PRE_WORMHOLE_TIME : PRE_WORMHOLE_TIME_OBJ)
      .then(() => {
        this.obj.setScale(0, 0); // also before jump
        this.moveToRandomPlace();
        return this.appear(POST_WORMHOLE_TIME).then(() => (this.canCollide = true));
      })
      .catch(() => {});
  }

  appear(time) {
    this.obj.setScale(0, 0);
    return this.animationHandler.grow(time).catch(() => {});
  }
}
