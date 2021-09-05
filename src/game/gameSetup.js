import { Cat } from './gameObjects/cat';
import { GameObject, ObjectType } from './gameObjects/gameObject';

const LEVEL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const ObjectSize = {
  SMALL: 50,
  MEDIUM: 60,
  LARGE: 70,
  XL: 100,
};

export function isLastLevel(level) {
  return level >= LEVEL_NUMBERS.length;
}

export function getNextLevel(level) {
  return isLastLevel(level) ? level : level + 1;
}

export function getAvailableLevelsAsString() {
  return LEVEL_NUMBERS.map((num) => `${num}`);
}

export function getLevelConfig(_level) {
  const level = Number(_level);
  if (level === 13) return getBonusLevel();
  const objectSize = level === 1 ? ObjectSize.XL : level < 4 ? ObjectSize.LARGE : level < 7 ? ObjectSize.MEDIUM : ObjectSize.SMALL;
  const catSize = objectSize * 1.5;

  return {
    cats: getCats(level, catSize),
    objects: getObjects(level, objectSize),
    goal: level,
  };
}

function getBonusLevel() {
  const aliens = [1, 2, 3, 4].map(() => new Cat({ character: '👽', size: 45 }));

  return {
    cats: getCats(9, 45),
    objects: [...getObjects(9, 30), ...getObjects(9, 30), ...aliens],
    goal: 13,
  };
}

function getCats(level, size) {
  const getNewCat = (character, leftKey, rightKey) => new Cat({ character, leftKey, rightKey, size });

  return [
    // players
    getNewCat('😻', 'left', 'right'),
    getNewCat('😸', 'a', 'd'),
    getNewCat('🙀', 'v', 'b'),
    getNewCat('😼', 'k', 'l'),
    getNewCat('😹', 'r', 't'),
    getNewCat('😽', 'u', 'i'),
    getNewCat('😿', 'n', 'm'),
    getNewCat('😺', 'x', 'c'),
    getNewCat('😾', 'g', 'h'),
  ].slice(0, level);
}

function getObjects(level, size) {
  const getNewGameObject = (type) => new GameObject({ type, size });

  return [
    // 1
    getNewGameObject(ObjectType.SYNTH),
    // 2
    getNewGameObject(ObjectType.ROCKET),
    getNewGameObject(ObjectType.ROCKET),
    // 3
    getNewGameObject(ObjectType.WORMHOLE),
    getNewGameObject(ObjectType.WORMHOLE),
    // 4
    getNewGameObject(ObjectType.SYNTH),
    getNewGameObject(ObjectType.TRAP),
    // 5
    getNewGameObject(ObjectType.ATTACK),
    getNewGameObject(ObjectType.ROCKET),
    // 6
    getNewGameObject(ObjectType.SHUFFLE),
    getNewGameObject(ObjectType.ROCKET),
    // 7
    getNewGameObject(ObjectType.DEATH),
    getNewGameObject(ObjectType.TRAP),
    // 8
    getNewGameObject(ObjectType.WORMHOLE),
    getNewGameObject(ObjectType.SYNTH),
    // 9
    getNewGameObject(ObjectType.ROCKET),
    getNewGameObject(ObjectType.DEATH),
  ].slice(0, level * 2 - 1);
}
