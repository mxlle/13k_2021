import { collides, GameLoop, setStoreItem } from 'kontra';
import { ObjectType } from './gameObject';
import { initScoreboard } from './score';
import { loadGame, setupExpertMode, StoreKey } from '../index';
import { getNextLevel, isLastLevel } from './gameSetup';
import { addBodyClasses, removeBodyClasses } from './utils';

export const SWAP_TIME = 5000;

export const Result = {
  WON: 'won',
  LOST: 'lost',
  BOTS: 'bots',
};

export const GameState = {
  STARTED: 'started',
  ENDED: 'ended',
  PREPARATION: 'prepare',
};

let loop;

let cats, objects, allObjects;

let currentLevel;

let gameInitialized = false;
let gameStarted = false;
let preparationMode = false;

export const isGameInitialized = () => gameInitialized;
export const isGameStarted = () => gameStarted;
export const isPreparationMode = () => preparationMode;

export function initGame(_cats, _objects, goal) {
  cats = _cats;
  objects = _objects;
  allObjects = [...objects, ...cats];
  updateLevel(goal);
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

export function prepareGame() {
  preparationMode = true;
  if (document.body.classList.contains(Result.WON)) {
    loadGame(getNextLevel(currentLevel));
  } else {
    loadGame();
  }
  removeBodyClasses(GameState.ENDED, Result.WON, Result.BOTS, Result.LOST);
  addBodyClasses(GameState.PREPARATION);
}

export function startGame() {
  preparationMode = false;
  gameStarted = true;
  addBodyClasses(GameState.STARTED);
  cats.forEach((cat) => cat.startMoving());
  // reset result after timeout to have it while css transition
  setTimeout(() => {
    removeBodyClasses(GameState.PREPARATION);
  }, 2000);
}

function endGame() {
  gameStarted = false;
  cats.forEach((cat) => cat.stop());

  // check who won
  if (cats.some((cat) => cat.isHuman() && cat.hasWon())) {
    addBodyClasses(Result.WON);
    // check all levels finished
    if (isLastLevel(currentLevel)) {
      setStoreItem(StoreKey.EXPERT, true);
      setupExpertMode();
    }
  } else if (cats.every((cat) => !cat.isHuman())) {
    addBodyClasses(Result.BOTS);
  } else {
    addBodyClasses(Result.LOST);
  }

  addBodyClasses(GameState.ENDED);
  removeBodyClasses(GameState.STARTED);
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

function updateLevel(newLevel) {
  currentLevel = newLevel;
  document.body.setAttribute('data-level', newLevel);
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
