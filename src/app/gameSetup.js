import { Cat } from './cat';
import { GameObject, ObjectSize, ObjectType } from './gameObject';

const LEVEL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function isLastLevel(level) {
  return level === LEVEL_NUMBERS.length;
}

export function getNextLevel(level) {
  return isLastLevel(level) ? level : level + 1;
}

export function getAvailableLevelsAsString() {
  return LEVEL_NUMBERS.map((num) => `${num}`);
}

export function getLevelConfig(_level) {
  const level = Number(_level);
  const objectSize = level === 1 ? ObjectSize.XL : level < 4 ? ObjectSize.LARGE : level < 7 ? ObjectSize.MEDIUM : ObjectSize.SMALL;
  const catSize = objectSize * 1.5;

  return {
    cats: getCats(level, catSize),
    objects: getObjects(level, objectSize),
    goal: level,
  };
}

function getCats(level, size) {
  return [
    // players
    new Cat('😻', 'left', 'right', size),
    new Cat('😸', 'a', 'd', size),
    new Cat('🙀', 'v', 'b', size),
    new Cat('😼', 'k', 'l', size),
    new Cat('😹', 'r', 't', size),
    new Cat('😽', 'u', 'i', size),
    new Cat('😿', 'n', 'm', size),
    new Cat('😺', 'x', 'c', size),
    new Cat('😾', 'g', 'h', size),
  ].slice(0, level);
}

function getObjects(level, size) {
  return [
    // 1
    new GameObject(ObjectType.SYNTH, size),
    // 2
    new GameObject(ObjectType.ROCKET, size),
    new GameObject(ObjectType.ROCKET, size),
    // 3
    new GameObject(ObjectType.WORMHOLE, size),
    new GameObject(ObjectType.WORMHOLE, size),
    // 4
    new GameObject(ObjectType.SYNTH, size),
    new GameObject(ObjectType.TRAP, size),
    // 5
    new GameObject(ObjectType.ATTACK, size),
    new GameObject(ObjectType.ROCKET, size),
    // 6
    new GameObject(ObjectType.SHUFFLE, size),
    new GameObject(ObjectType.ROCKET, size),
    // 7
    new GameObject(ObjectType.DEATH, size),
    new GameObject(ObjectType.TRAP, size),
    // 8
    new GameObject(ObjectType.WORMHOLE, size),
    new GameObject(ObjectType.SYNTH, size),
    // 9
    new GameObject(ObjectType.ROCKET, size),
    new GameObject(ObjectType.DEATH, size),
  ].slice(0, level * 2 - 1);
}
