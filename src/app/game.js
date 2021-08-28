import { collides, GameLoop } from 'kontra';
import { ObjectType } from './gameObject';
import { getGoal, setGoal, updateScoreboard } from './score';
import { loadLevel } from '../index';
import { getNextLevel } from './gameSetup';

export const SWAP_TIME = 5000;

let loop;

let cats;
let objects;
let allObjects;

let gameInitialized = false;
let gameStarted = false;

export const isGameInitialized = () => gameInitialized;
export const isGameStarted = () => gameStarted;

export function initGame(_cats, _objects, goal) {
  cats = _cats;
  objects = _objects;
  allObjects = [...cats, ...objects];
  setGoal(goal);
  updateScoreboard(cats);
  if (!loop) {
    loop = getGameLoop();
    loop.start();
  }
}

function getGameLoop() {
  return GameLoop({
    // create the main game loop
    update: function () {
      if (!gameStarted) return;

      // move cats
      cats.forEach((cat) => cat.move());

      // check for collisions
      const collisions = getCollisions(allObjects);
      const wormholeLater = [];
      collisions.forEach(({ cat, obj }) => {
        switch (obj.type) {
          case ObjectType.CAT:
            // CRASH -> WHOOSH
            cat.deceleratingWormhole();
            obj.deceleratingWormhole();
            break;
          case ObjectType.SYNTH:
            // SCORE
            cat.incScore();
            updateScoreboard(cats);
            wormholeLater.push(obj);
            break;
          case ObjectType.ROCKET:
            // ACCELERATE
            cat.speedUp();
            obj.wormhole();
            break;
          case ObjectType.WORMHOLE:
            // WHOOSH
            cat.wormhole();
            obj.wormhole();
            break;
          case ObjectType.DIE:
            // EVERYBODY SHUFFLING
            shuffleObjects();
            break;
          case ObjectType.ATTACK:
            // ATTACK
            swapControls(cat, obj);
            break;
          case ObjectType.TRAP:
            // OOPS
            cat.swapControls();
            obj.wormhole();
            break;
          case ObjectType.DEATH:
            // BYE-BYE SCORE
            cat.resetScore();
            updateScoreboard(cats);
            obj.wormhole();
            break;
        }
      });

      // check game end condition
      if (cats.some((cat) => cat.hasWon())) {
        endGame();
      } else {
        wormholeLater.forEach((obj) => obj.wormhole());
      }
    },
    render: function () {
      allObjects.forEach((obj) => obj.obj.render());
      gameInitialized = true;
    },
  });
}

export function startGame() {
  if (document.body.classList.contains('victory')) {
    loadLevel(getNextLevel(getGoal()));
    document.body.classList.remove('victory');
  }
  gameStarted = true;
  document.body.classList.add('gameStarted');
  cats.forEach((cat) => cat.startMoving());
}

function endGame() {
  gameStarted = false;
  cats.forEach((cat) => cat.stop());
  document.body.classList.add('victory');
  document.body.classList.remove('gameStarted');
}

export function getFirstCat() {
  return cats[0];
}

export function shuffleAll() {
  allObjects.forEach((obj) => obj.wormhole());
}
function shuffleObjects() {
  objects.forEach((obj) => obj.wormhole());
}

function swapControls(cat, devil) {
  const otherCats = cats.filter((c) => c.id !== cat.id);
  otherCats.forEach((c) => {
    c.swapControls();
  });
  devil.hideForTime(SWAP_TIME);
}

function getCollisions(objs) {
  const collisions = [];

  for (let i = 0; i < objs.length - 1; i++) {
    for (let j = i + 1; j < objs.length; j++) {
      let o1 = objs[i];
      let o2 = objs[j];
      let cat, obj;
      if (o1.isCat()) {
        cat = o1;
        obj = o2;
      } else if (o2.isCat()) {
        cat = o2;
        obj = o1;
      } else {
        // no collision if no cat involved
        continue;
      }

      if (collides(cat.obj, obj.obj)) {
        collisions.push({ cat, obj });
      }
    }
  }

  return collisions;
}
