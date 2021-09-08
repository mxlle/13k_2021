import { Cat } from './gameObjects/cat';

export const ALL_PLAYERS = [
  { character: '😻', leftKey: 'left', rightKey: 'right' },
  { character: '😸', leftKey: 'a', rightKey: 'd' },
  { character: '🙀', leftKey: 'v', rightKey: 'b' },
  { character: '😼', leftKey: 'k', rightKey: 'l' },
  { character: '😹', leftKey: 'r', rightKey: 't' },
  { character: '😽', leftKey: 'u', rightKey: 'i' },
  { character: '😿', leftKey: 'n', rightKey: 'm' },
  { character: '😺', leftKey: 'x', rightKey: 'c' },
  { character: '😾', leftKey: 'g', rightKey: 'h' },
];

export function getCats(amount, size) {
  return ALL_PLAYERS.slice(0, amount).map((p) => new Cat({ ...p, size }));
}

export function getCatsString() {
  return ALL_PLAYERS.map((p) => p.character).join('');
}

export function getCatsFromString(objectsString, size) {
  return ALL_PLAYERS.filter((p) => objectsString.includes(p.character)).map((p) => new Cat({ ...p, size }));
}

export function getIncludedCatsString(objectsString) {
  return ALL_PLAYERS.map((p) => p.character)
    .filter((char) => objectsString.includes(char))
    .join('');
}
