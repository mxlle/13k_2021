import { Cat } from './cat';
import { GameObject, ObjectType } from './gameObject';

export function getNextLevel(level) {
  return Math.min(level + 1, getCats(42).length);
}

export function getAvailableLevels() {
  return getCats(42).map((_, index) => `${index + 1}`);
}

export function getLevelConfig(_level) {
  const level = Number(_level);

  return {
    cats: getCats(level),
    objects: getObjects(level),
    goal: level,
  };
}

function getCats(level) {
  return [
    // players
    new Cat('😻', 'left', 'right'),
    new Cat('😸', 'a', 'd'),
    new Cat('🙀', 'v', 'b'),
    new Cat('😼', 'k', 'l'),
    new Cat('😹', 'r', 't'),
    new Cat('😽', 'u', 'i'),
    new Cat('😿', 'n', 'm'),
    new Cat('😺', 'x', 'c'),
    new Cat('😾', 'g', 'h'),
  ].slice(0, level);
}

function getObjects(level) {
  return [
    new GameObject(ObjectType.SYNTH),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.SYNTH),
    new GameObject(ObjectType.TRAP),
    new GameObject(ObjectType.ATTACK),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.DIE),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.DEATH),
    new GameObject(ObjectType.TRAP),
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.SYNTH),
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.DEATH),
  ].slice(0, level * 2 - 1);
}
