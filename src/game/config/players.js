import { Cat } from '../gameObjects/cat';

export const ALL_CATS = ['😻', '😸', '🙀', '😼', '😹', '😽', '😿', '😺', '😾'];

const PLAYER_CONTROLS = [
  { leftKey: 'left', rightKey: 'right' },
  { leftKey: 'a', rightKey: 'd' },
  { leftKey: 'v', rightKey: 'b' },
  { leftKey: 'k', rightKey: 'l' },
  { leftKey: 'r', rightKey: 't' },
  { leftKey: 'u', rightKey: 'i' },
  { leftKey: 'n', rightKey: 'm' },
  { leftKey: 'x', rightKey: 'c' },
  { leftKey: 'g', rightKey: 'h' },
];

export function getCats(amount, size) {
  return getPlayerConfigs(ALL_CATS)
    .slice(0, amount)
    .map((config) => new Cat({ ...config, size }));
}

export function getCatsFromString(objectsString, size) {
  return getPlayerConfigs(ALL_CATS)
    .filter((config) => objectsString.includes(config.character))
    .map((config) => new Cat({ ...config, size }));
}

function getPlayerConfigs(characters) {
  return characters.map((character, index) => {
    const controls = PLAYER_CONTROLS[index];
    return { character, ...controls };
  });
}
