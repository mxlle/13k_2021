import {addBackgroundScene} from "./app/scene.js";

const HIGH_SCORE_KEY = 'mxlle.spacecat.highScore';

let intervalId;
let intervalCount = 0;

let score = 0;
let victoryInPosition = false;

function init() {
    addBackgroundScene();

    document.addEventListener("click", function(event){
        const cat = document.getElementById("cat");
        cat.style.left = event.pageX + "px";
        cat.style.top = event.pageY + "px";
        if (Math.random() > 0.2) {
            synthFleesToOtherPosition();
        }
        startIntervalChecking();
    });

    document.addEventListener("keydown", function(event){
        if (event.code === "Space"){
            const cat = document.getElementById("cat");
            cat.classList.add("animated");
        }
    });

    document.addEventListener("keyup", function(event){
        if (event.code === "Space"){
            const cat = document.getElementById("cat");
            cat.classList.remove("animated");
        }
    });
}

function startIntervalChecking() {
    intervalCount = 0;

    if (!intervalId) {
        intervalId = setInterval(() => {
            checkWinningCondition();
            intervalCount++;
            if (intervalCount >= 20) {
                clearInterval(intervalId);
                intervalId = undefined;
            }
        }, 100);
    }
}

function checkWinningCondition() {
    const cat = document.getElementById("cat");
    const synth = document.getElementById("synth");
    const catBox = cat.getBoundingClientRect();
    const synthBox = synth.getBoundingClientRect();

    console.log('CHECK WINNING CONDITION');

    const overlap = !(catBox.right < synthBox.left ||
        catBox.left > synthBox.right ||
        catBox.bottom < synthBox.top ||
        catBox.top > synthBox.bottom);

    if (overlap) {
        document.body.classList.add("victory");
    } else {
        document.body.classList.remove("victory");
    }

    if (overlap && !victoryInPosition) {
        score++;
        victoryInPosition = true;
        updateDisplayedScore();
    }
}

function updateDisplayedScore() {
    let highScore = getHighScore();
    if (score > highScore) {
        highScore = score;
        saveHighScore(highScore);
    }
    document.getElementById("score").innerText = `Score: ${score} High Score: ${highScore}`;
}

function synthFleesToOtherPosition() {
    const synth = document.getElementById("synth");
    synth.style.left = getRandomInt(0, window.innerWidth) + "px";
    synth.style.top = getRandomInt(0, window.innerHeight) + "px";
    victoryInPosition = false;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getHighScore() {
    return Number(localStorage.getItem(HIGH_SCORE_KEY));
}

function saveHighScore(score) {
    localStorage.setItem(HIGH_SCORE_KEY, score);
}

// START
init();
updateDisplayedScore();
