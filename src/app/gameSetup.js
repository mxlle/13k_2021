import { Cat } from './cat';
import { GameObject, ObjectType } from './gameObject';

export function getCats() {
  return [
    // players
    new Cat('🐈', 'left', 'right'),
    new Cat('😻', 'a', 'd'),
    new Cat('🐅', 'v', 'b'),
    new Cat('🦁', 'k', 'l'),
    new Cat('🐈‍⬛', '1', '2'),
  ];
}

export function getObjects() {
  return [
    new GameObject(ObjectType.SYNTH),
    new GameObject(ObjectType.SYNTH),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.ATTACK),
    new GameObject(ObjectType.DIE),
    new GameObject(ObjectType.TRAP),
    new GameObject(ObjectType.DEATH),
  ];
}
