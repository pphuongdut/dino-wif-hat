import { setupGround, updateGround } from './ground.js';
import { setupDino, updateDino, getDinoRect, setDinoLose } from './dino.js';
import { setupCactus, updateCactus, getCactusRects } from './cactus.js';
import { setupSand, updateSand } from './sand.js';

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 45;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world]');
const thoughScoreElem = document.querySelector('[though-score]');
const scoreSpan = document.querySelector('[data-score-number]');
const startScreenElem = document.querySelector('[data-start-screen]');
const resultScoreElem = document.querySelector('.dino--lost');
const jumpButton = document.querySelector('.jump-button');

setPixelToWorldScale();
updateStartScreenContent();

window.addEventListener('resize', () => {
    setPixelToWorldScale(), updateStartScreenContent();
});
document.addEventListener('keydown', handleStart, { once: true });
document.addEventListener('touchstart', handleStart, { once: true });
document.addEventListener('touchstart', function () {
    const spaceKeyEvent = new KeyboardEvent('keydown', {
        code: 'Space',
        key: ' ',
        keyCode: 32,
        which: 32,
        bubbles: true,
        cancelable: true,
    });

    // Dispatch the space key event
    document.dispatchEvent(spaceKeyEvent);
});
jumpButton.addEventListener('click', function () {
    const spaceKeyEvent = new KeyboardEvent('keydown', {
        code: 'Space',
        key: ' ',
        keyCode: 32,
        which: 32,
        bubbles: true,
        cancelable: true,
    });

    // Dispatch the space key event
    document.dispatchEvent(spaceKeyEvent);
});

let lastTime;
let speedScale;
let score;

function update(time) {
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }
    const delta = time - lastTime;
    updateGround(delta, speedScale);
    updateSand(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);
    if (checkLose()) return handleLose();

    lastTime = time;
    window.requestAnimationFrame(update);
}

function checkLose() {
    const dinoRect = getDinoRect();
    const padding = window.innerWidth < 500 ? 80 : 120;
    return getCactusRects().some((rect) =>
        isCollision(rect, dinoRect, padding)
    );
}

function isCollision(rect1, rect2, padding = 100) {
    return (
        rect1.left < rect2.right - padding &&
        rect1.top < rect2.bottom - padding &&
        rect1.right > rect2.left + padding &&
        rect1.bottom > rect2.top + padding
    );
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
    score += delta * 0.001;
    const roundedUpScore = Math.round(score * 1000) / 1000;
    scoreSpan.textContent = roundedUpScore + ' ETH';
}

function updateEndGameStatus() {
    showSmoke();
    showMoney();

    // After 3 seconds, hide the dino
    setTimeout(function () {
        hideSmoke();
    }, 3000);
}

function showSmoke() {
    document
        .querySelector('.dino--lost')
        .classList.add('animate__animated', 'animate__bounceIn');
    document.querySelector('.dino--lost').style.display = 'block';
}

function hideSmoke() {
    document.querySelector('.dino--lost').classList.remove('animate__bounceIn');
    document.querySelector('.dino--lost').classList.add('animate__fadeOut');
    setTimeout(() => {
        document.querySelector('.dino--lost').style.display = 'none';
    }, 1000);
}

function showMoney() {
    document
        .querySelector('.result--money')
        .classList.add('animate__animated', 'animate__bounce');
    document.querySelector('.result--money').style.display = 'block';
}

function hideMoney() {
    document.querySelector('.result--money').style.display = 'none';
}

function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupSand();
    setupDino();
    setupCactus();
    hideSmoke();
    hideMoney();
    startScreenElem.classList.add('hidden');
    window.requestAnimationFrame(update);
    resultScoreElem.classList.add('hidden');
}

function updateStartScreenContent() {
    // check on mobile
    if (window.innerWidth < 500) {
        startScreenElem.textContent = 'Tap anywhere to start';
    } else {
        startScreenElem.textContent = 'Press any key to start';
    }
}

function handleLose() {
    setDinoLose();
    updateEndGameStatus();

    setTimeout(() => {
        document.addEventListener('keydown', handleStart, { once: true });
        startScreenElem.classList.remove('hidden');
        resultScoreElem.classList.remove('hidden');
    }, 100);
}
function setPixelToWorldScale() {}
