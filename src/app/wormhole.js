import { randInt } from '../../node_modules/kontra/kontra.mjs';

export function wormhole(obj) {
  obj.x = randInt(0, window.innerWidth - obj.width);
  obj.y = randInt(0, window.innerHeight - obj.height);
}
