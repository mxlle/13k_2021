import { init, GameLoop, initKeys, bindKeys, collides } from 'kontra';

import './index.css';

import { Cat } from './app/cat';
import { addBackgroundScene } from './app/scene';
import { GOAL, updateScoreboard } from './app/score';
import { GameObject, ObjectType } from './app/gameObject';

let gameInitialized = false;
let gameStarted = false;
let { canvas } = init();
initKeys();

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (gameInitialized) allObjects.forEach((obj) => obj.wormhole());
}

resizeCanvas();

bindKeys('space', onSpace);

const cats = [new Cat(ObjectType.CAT, '🐈', 'left', 'right'), new Cat(ObjectType.CAT, '🐱', 'a', 'd')];
const objects = [new GameObject(ObjectType.SYNTH), new GameObject(ObjectType.ROCKET)];
const allObjects = [...cats, ...objects];

let loop = GameLoop({
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
          cat.deceleratingWormhole();
          obj.deceleratingWormhole();
          break;
        case ObjectType.SYNTH:
          cat.incScore();
          wormholeLater.push(obj);
          break;
        case ObjectType.ROCKET:
          cat.wormhole();
          obj.wormhole();
          break;
      }
    });

    updateScoreboard(cats);

    if (cats.some((cat) => cat.score >= GOAL)) {
      endGame();
    } else {
      wormholeLater.forEach((obj) => obj.wormhole());
    }
  },
  render: function () {
    cats.forEach((cat) => cat.obj.render());
    objects.forEach((obj) => obj.obj.render());
    gameInitialized = true;
  },
});

function onSpace() {
  if (gameStarted) {
    cats.forEach((cat) => cat.speedUp());
  } else {
    startGame();
  }
}

function endGame() {
  gameStarted = false;
  cats.forEach((cat) => cat.stop());
  document.body.classList.add('victory');
}

function startGame() {
  if (document.body.classList.contains('victory')) {
    objects.forEach((obj) => obj.wormhole());
    cats.forEach((cat) => cat.resetScore());
    updateScoreboard(cats);
    document.body.classList.remove('victory');
  }
  gameStarted = true;
  cats.forEach((cat) => cat.startMoving());
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

document.addEventListener('click', function (event) {
  if (event.target.id === 'space-key') {
    onSpace();
    cats.forEach((cat) => (cat.random = !cat.random));
  }
});

// START
addBackgroundScene();
updateScoreboard(cats);
loop.start();
