import { Cat } from './cat';
import { GameObject, ObjectType } from './gameObject';

export function isLastLevel(level) {
  return level === getAllCats().length;
}

export function getNextLevel(level) {
  return isLastLevel(level) ? level : level + 1;
}

export function getAvailableLevels() {
  return getAllCats().map((_, index) => `${index + 1}`);
}

export function getLevelConfig(_level) {
  const level = Number(_level);

  return {
    cats: getCats(level),
    objects: getObjects(level),
    goal: level,
  };
}

function getAllCats() {
  return getCats(42);
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
    // 1
    new GameObject(ObjectType.SYNTH),
    // 2
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.ROCKET),
    // 3
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.WORMHOLE),
    // 4
    new GameObject(ObjectType.SYNTH),
    new GameObject(ObjectType.TRAP),
    // 5
    new GameObject(ObjectType.ATTACK),
    new GameObject(ObjectType.ROCKET),
    // 6
    new GameObject(ObjectType.DIE),
    new GameObject(ObjectType.ROCKET),
    // 7
    new GameObject(ObjectType.DEATH),
    new GameObject(ObjectType.TRAP),
    // 8
    new GameObject(ObjectType.WORMHOLE),
    new GameObject(ObjectType.SYNTH),
    // 9
    new GameObject(ObjectType.ROCKET),
    new GameObject(ObjectType.DEATH),
  ].slice(0, level * 2 - 1);
}
