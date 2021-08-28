import { collides, GameLoop, setStoreItem } from 'kontra';
import { ObjectType } from './gameObject';
import { initScoreboard } from './score';
import { loadGame, setupExpertMode, StoreKey } from '../index';
import { getNextLevel, isLastLevel } from './gameSetup';

export const SWAP_TIME = 5000;

export const Result = {
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  BOT_ONLY: 'bot-only',
};

export const GameState = {
  STARTED: 'game-started',
  ENDED: 'game-ended',
};

let loop;

let cats, objects, allObjects;

let currentLevel;

let gameInitialized = false;
let gameStarted = false;

export const isGameInitialized = () => gameInitialized;
export const isGameStarted = () => gameStarted;

export function initGame(_cats, _objects, goal) {
  cats = _cats;
  objects = _objects;
  allObjects = [...cats, ...objects];
  currentLevel = goal;
  initScoreboard(goal, cats);
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
      cats.forEach((cat) => cat.update());

      // check for collisions
      const collisions = getCollisions(allObjects);
      const wormholeLater = [];
      collisions.forEach(({ cat, obj }) => {
        switch (obj.type) {
          case ObjectType.CAT:
            // CRASH -> WHOOSH
            if (cat.canCollide && obj.canCollide) {
              cat.handleCrash(1);
              obj.handleCrash(-1);
            }
            break;
          case ObjectType.SYNTH:
            // SCORE
            cat.incScore();
            wormholeLater.push(obj);
            break;
          case ObjectType.ROCKET:
            // ACCELERATE
            cat.speedUp();
            obj.wormhole();
            break;
          case ObjectType.WORMHOLE:
            // WHOOSH
            if (obj.canCollide) {
              cat.handleWormhole(obj);
            }
            break;
          case ObjectType.SHUFFLE:
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
      allObjects.forEach((obj) => obj.render());
      gameInitialized = true;
    },
  });
}

export function startGame() {
  if (document.body.classList.contains(Result.VICTORY)) {
    loadGame(getNextLevel(currentLevel));
  } else {
    loadGame();
  }
  gameStarted = true;
  document.body.classList.remove(GameState.ENDED);
  document.body.classList.add(GameState.STARTED);
  cats.forEach((cat) => cat.startMoving());
  // reset result after timeout to have it while css transition
  setTimeout(() => {
    document.body.classList.remove(Result.VICTORY, Result.BOT_ONLY, Result.DEFEAT);
  }, 2000);
}

function endGame() {
  gameStarted = false;
  cats.forEach((cat) => cat.stop());

  // check who won
  if (cats.some((cat) => cat.isHuman() && cat.hasWon())) {
    document.body.classList.add(Result.VICTORY);
    // check all levels finished
    if (isLastLevel(currentLevel)) {
      setStoreItem(StoreKey.EXPERT, true);
      setupExpertMode();
    }
  } else if (cats.every((cat) => !cat.isHuman())) {
    document.body.classList.add(Result.BOT_ONLY);
  } else {
    document.body.classList.add(Result.DEFEAT);
  }

  document.body.classList.add(GameState.ENDED);
  document.body.classList.remove(GameState.STARTED);
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

function swapControls(cat, attack) {
  const otherCats = cats.filter((c) => c.id !== cat.id);
  otherCats.forEach((c) => {
    c.swapControls();
  });
  attack.hideForTime(SWAP_TIME);
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

      if (collides(cat.collisionDetector, obj.collisionDetector)) {
        collisions.push({ cat, obj });
      }
    }
  }

  return collisions;
}
