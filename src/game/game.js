import './game.scss';

import { collides, GameLoop } from 'kontra';
import { GameObject, ObjectType } from './gameObjects/gameObject';
import { initScoreboard } from './score/score';
import { FPS, loadGame, setupExpertMode } from '../index';
import { getNextLevel, isLastLevel } from './config/gameSetup';
import { addBodyClasses, removeBodyClasses } from './utils';
import { updateSkyColor } from './scene/scene';
import { updateHints } from './hints/hints';
import { storeExportMode } from './store';

export const SWAP_TIME = 5000;

export const Result = {
  WON: 'won',
  LOST: 'lost',
};

export const GameState = {
  STARTED: 'started',
  ENDED: 'ended',
  PREPARATION: 'prepare',
};

let loop;

let players = [],
  objects = [],
  oneTimeObjects = [];

let currentLevel;

let gameInitialized = false;
let gameStarted = false;
let gameEnded = false;
let preparationMode = false;

export const isGameInitialized = () => gameInitialized;
export const isGameStarted = () => gameStarted;
export const isGameEnded = () => gameEnded;
export const isPreparationMode = () => preparationMode;

export function initGame(_players, _objects, goal, level) {
  players = _players;
  objects = _objects;
  updateLevel(level);
  updateSkyColor();
  initScoreboard(goal, players);
  if (!loop) {
    loop = getGameLoop();
    loop.start();
  }
}

function getGameLoop() {
  return GameLoop({
    // create the main game loop
    fps: FPS,
    update: function () {
      if (!gameStarted) return;

      // move players
      players.forEach((player) => player.update());

      // update objects (for animations)
      objects.forEach((object) => object.update());
      oneTimeObjects.forEach((object) => object.update());

      if (gameEnded) return; // let objects move, but do not handle collisions once game has ended

      // check for collisions
      const collisions = getCollisions(getAllObjects());
      const wormholeLater = [];
      collisions.forEach(({ player, obj }) => {
        switch (obj.type) {
          case ObjectType.PLAYER:
            // CRASH
            if (!player.crashSafety && !obj.crashSafety) {
              player.handleCrash(1);
              obj.handleCrash(-1);
            }
            break;
          case ObjectType.TARGET:
            // SCORE
            player.incScore();
            wormholeLater.push(obj);
            updateSkyColor();
            break;
          case ObjectType.ROCKET:
            // ACCELERATE
            player.speedUp();
            obj.wormhole();
            break;
          case ObjectType.WORMHOLE:
            // WHOOSH
            player.handleWormhole(obj);
            break;
          case ObjectType.SHUFFLE:
            // EVERYBODY SHUFFLING
            shuffleObjects();
            break;
          case ObjectType.ATTACK:
            // ATTACK
            attackOthers(player, obj);
            break;
          case ObjectType.TRAP:
            // OOPS
            player.confuse();
            if (obj.oneTime) removeOneTimeObject(obj);
            else obj.wormhole();
            break;
          case ObjectType.DEATH:
            // BYE-BYE SCORE
            player.resetScore();
            obj.wormhole();
            break;
          default:
            // bumping into custom object
            if (!player.crashSafety) {
              player.handleCrash(1);
            }
        }
      });

      // check game end condition
      if (players.some((player) => player.hasWon())) {
        endGame();
      } else {
        wormholeLater.forEach((obj) => obj.wormhole());
      }
    },
    render: function () {
      getAllObjects().forEach((obj) => !obj.hidden && obj.render());
      gameInitialized = true;
    },
  });
}

export function prepareGame() {
  preparationMode = true;
  gameEnded = false;
  if (document.body.classList.contains(Result.WON)) {
    loadGame(getNextLevel(currentLevel));
  } else {
    loadGame();
  }
  removeBodyClasses(GameState.ENDED, Result.WON, Result.LOST);
  addBodyClasses(GameState.PREPARATION);
}

export function startGame() {
  preparationMode = false;
  gameStarted = true;
  addBodyClasses(GameState.STARTED);
  // reset result after timeout to have it while css transition
  setTimeout(() => {
    removeBodyClasses(GameState.PREPARATION);
  }, 2000);
  updateHints();
}

function endGame() {
  gameEnded = true;
  let won = false;

  // check who won
  if (players.some((player) => player.isHuman() && player.hasWon())) {
    addBodyClasses(Result.WON);
    won = true;
    // check all levels finished
    if (isLastLevel(currentLevel)) {
      storeExportMode();
      setupExpertMode();
    }
  } else {
    addBodyClasses(Result.LOST);
  }

  addBodyClasses(GameState.ENDED);
  removeBodyClasses(GameState.STARTED);

  updateHints(won);

  spinAllRandomly(won ? 2 : 1).then(() => {
    gameStarted = false;
    players.forEach((player) => player.reset());
  });
}

export function getCurrentLevel() {
  return currentLevel;
}

export function shuffleAndScaleAll() {
  getAllObjects().forEach((obj) => {
    obj.updateScale();
    obj.moveToRandomPlace();
  });
}

function shuffleObjects() {
  updateSkyColor();
  objects.forEach((obj, index) => {
    obj.animationHandler.spinAround(1000, index % 2 === 0 ? -1 : 1, 2).catch(() => {});
    obj.wormhole();
  });
}

async function spinAllRandomly(turns) {
  const all = getAllObjects();
  const promises = [];
  for (let i = 0; i < all.length; i++) {
    promises.push(all[i].animationHandler.spinAround(1000, i % 2 === 0 ? -1 : 1, turns).catch(() => {}));
  }
  return Promise.all(promises);
}

function attackOthers(player, attack) {
  const otherPlayers = players.filter((p) => p.id !== player.id);
  otherPlayers.forEach((c) => {
    const trap = new GameObject({ type: ObjectType.TRAP, size: c.defaultSize / 1.5 });
    trap.x = c.x + c.dx * 45;
    trap.y = c.y + c.dy * 45;
    addOneTimeObject(trap);
  });
  attack.hideForTime(SWAP_TIME);
}

function addOneTimeObject(obj) {
  obj.oneTime = true;
  obj.appear(300);
  obj.animationHandler.spinAround(300, 1, 1);
  oneTimeObjects.push(obj);
}

function removeOneTimeObject(obj) {
  const index = oneTimeObjects.findIndex((o) => o.id === obj.id);
  if (index >= 0) oneTimeObjects.splice(index, 1);
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

      if (!o1.canCollide || !o2.canCollide || o1.hidden || o2.hidden) {
        continue;
      }

      let player, obj;
      if (o1.isPlayer()) {
        player = o1;
        obj = o2;
      } else if (o2.isPlayer()) {
        player = o2;
        obj = o1;
      } else {
        // no collision if no player involved
        continue;
      }

      if (collides(player, obj)) {
        collisions.push({ player, obj });
      }
    }
  }

  return collisions;
}

function getAllObjects() {
  return [...objects, ...oneTimeObjects, ...players];
}
