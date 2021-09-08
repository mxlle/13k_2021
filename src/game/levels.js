import { GameObject, ObjectType } from './gameObjects/gameObject';

export const LEVEL_OBJECTS = [
  // 1
  ObjectType.SYNTH,
  // 2
  ObjectType.ROCKET,
  ObjectType.ROCKET,
  // 3
  ObjectType.WORMHOLE,
  ObjectType.WORMHOLE,
  // 4
  ObjectType.SYNTH,
  ObjectType.TRAP,
  // 5
  ObjectType.ATTACK,
  ObjectType.ROCKET,
  // 6
  ObjectType.SHUFFLE,
  ObjectType.ROCKET,
  // 7
  ObjectType.DEATH,
  ObjectType.TRAP,
  // 8
  ObjectType.WORMHOLE,
  ObjectType.SYNTH,
  // 9
  ObjectType.ROCKET,
  ObjectType.DEATH,
];

export function getLevelObjects(level, size) {
  return LEVEL_OBJECTS.slice(0, level * 2 - 1).map((o) => new GameObject({ type: o, size }));
}
