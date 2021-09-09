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

export function getAllPlayers() {
  return ALL_CATS;
}

export function getPlayerConfigs(emojis) {
  return emojis.map((emoji, index) => {
    const controls = PLAYER_CONTROLS[index];
    return { emoji, ...controls };
  });
}
