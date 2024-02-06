import {
    getCustomProperty,
    incrementCustomProperty,
    setCustomProperty,
} from './updateCustomProperty.js';

const sandElems = document.querySelectorAll('[data-sand');
const SPEED = 0.01;

export function setupSand() {
    setCustomProperty(sandElems[0], '--left', 0);
    setCustomProperty(sandElems[1], '--left', 300);
}
export function updateSand(delta, speedScale) {
    sandElems.forEach((sand) => {
        incrementCustomProperty(
            sand,
            '--left',
            delta * speedScale * SPEED * -1
        );

        if (getCustomProperty(sand, '--left') <= -300) {
            incrementCustomProperty(sand, '--left', 600);
        }
    });
}
