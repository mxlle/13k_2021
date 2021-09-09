export const ObjectType = {
  MOVING: '🐱',
  TARGET: '🎹',
  ROCKET: '🚀',
  WORMHOLE: '💥',
  SHUFFLE: '🎲',
  ATTACK: '🔫',
  TRAP: '💩',
  DEATH: '☠️',
};

export const MovingType = ObjectType.MOVING;

export function getValidObjectTypes() {
  return Object.values(ObjectType).filter((type) => type !== MovingType);
}
