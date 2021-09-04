import { Cat } from './cat';
import { GameObject, ObjectType } from './gameObject';

const LEVEL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const ObjectSize = {
  SMALL: 50,
  MEDIUM: 60,
  LARGE: 70,
  XL: 100,
};

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
    new Cat({ character: '😻', leftKey: 'left', rightKey: 'right', size }),
    new Cat({ character: '😸', leftKey: 'a', rightKey: 'd', size }),
    new Cat({ character: '🙀', leftKey: 'v', rightKey: 'b', size }),
    new Cat({ character: '😼', leftKey: 'k', rightKey: 'l', size }),
    new Cat({ character: '😹', leftKey: 'r', rightKey: 't', size }),
    new Cat({ character: '😽', leftKey: 'u', rightKey: 'i', size }),
    new Cat({ character: '😿', leftKey: 'n', rightKey: 'm', size }),
    new Cat({ character: '😺', leftKey: 'x', rightKey: 'c', size }),
    new Cat({ character: '😾', leftKey: 'g', rightKey: 'h', size }),
  ].slice(0, level);
}

function getObjects(level, size) {
  return [
    // 1
    new GameObject({ type: ObjectType.SYNTH, size }),
    // 2
    new GameObject({ type: ObjectType.ROCKET, size }),
    new GameObject({ type: ObjectType.ROCKET, size }),
    // 3
    new GameObject({ type: ObjectType.WORMHOLE, size }),
    new GameObject({ type: ObjectType.WORMHOLE, size }),
    // 4
    new GameObject({ type: ObjectType.SYNTH, size }),
    new GameObject({ type: ObjectType.TRAP, size }),
    // 5
    new GameObject({ type: ObjectType.ATTACK, size }),
    new GameObject({ type: ObjectType.ROCKET, size }),
    // 6
    new GameObject({ type: ObjectType.SHUFFLE, size }),
    new GameObject({ type: ObjectType.ROCKET, size }),
    // 7
    new GameObject({ type: ObjectType.DEATH, size }),
    new GameObject({ type: ObjectType.TRAP, size }),
    // 8
    new GameObject({ type: ObjectType.WORMHOLE, size }),
    new GameObject({ type: ObjectType.SYNTH, size }),
    // 9
    new GameObject({ type: ObjectType.ROCKET, size }),
    new GameObject({ type: ObjectType.DEATH, size }),
  ].slice(0, level * 2 - 1);
}
