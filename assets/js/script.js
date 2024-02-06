import { setupGround, updateGround } from './ground.js';
import { setupDino, updateDino, getDinoRect, setDinoLose } from './dino.js';
import { setupCactus, updateCactus, getCactusRects } from './cactus.js';
import { setupSand, updateSand } from './sand.js';

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 45;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const scoreSpan = document.querySelector('[data-score-number]');
const startScreenElem = document.querySelector('[data-start-screen]');

setPixelToWorldScale();

window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart, { once: true });
document.addEventListener('touchstart', handleStart, { once: true });

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
    return getCactusRects().some((rect) => isCollision(rect, dinoRect));
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

function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupSand();
    setupDino();
    setupCactus();
    startScreenElem.classList.add('hidden');
    window.requestAnimationFrame(update);
}

function handleLose() {
    setDinoLose();
    setTimeout(() => {
        document.addEventListener('keydown', handleStart, { once: true });
        startScreenElem.classList.remove('hidden');
    }, 100);
}
function setPixelToWorldScale() {
    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH;
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
    }
    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
