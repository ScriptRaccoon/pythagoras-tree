// DOM constants

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const iterationSpan = document.getElementById("iterationSpan");
const iterationInput = document.getElementById("iterationInput");
const drawBtn = document.getElementById("drawBtn");
const minAngleInput = document.getElementById("minAngleInput");
const maxAngleInput = document.getElementById("maxAngleInput");
const minAngleSpan = document.getElementById("minAngleSpan");
const maxAngleSpan = document.getElementById("maxAngleSpan");

// other variables

const drawSpeed = 10;
let canDraw = true;
let initialLength = 180;

// adjust canvas

function adjustCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "darkgreen";
    ctx.strokeStyle = "white";
    initialLength = Math.min(canvas.height / 6, canvas.width / 8);
}

adjustCanvas();

// adjust start position

let startPosA, startPosB;

function adjustStartPos() {
    startPosA = [canvas.width / 2 - initialLength / 2, canvas.height - 100];
    startPosB = [canvas.width / 2 + initialLength / 2, canvas.height - 100];
}

adjustStartPos();

// ensure that canvas stays full screen

window.addEventListener("resize", () => {
    adjustCanvas();
    adjustStartPos();
});

// show values

function showValues() {
    minAngleSpan.innerText = minAngleInput.value;
    maxAngleSpan.innerText = maxAngleInput.value;
    iterationSpan.innerText = iterationInput.value;
}

showValues();

// input elements

minAngleInput.addEventListener("change", showValues);
maxAngleInput.addEventListener("change", showValues);
iterationInput.addEventListener("change", showValues);

// draw button

drawBtn.addEventListener("click", () => {
    if (minAngleInput.value <= maxAngleInput.value) {
        canDraw = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canDraw = true;
            drawSquare(startPosA, startPosB, iterationInput.value);
        }, 2 * drawSpeed + 1);
    }
});

// main draw function

function drawSquare(posA, posB, depth) {
    if (!canDraw) return;
    canDraw = true;
    const length = distance(posA, posB);
    const a = angle(posA, posB);
    const shiftedPosA = add(posA, scale(length, rotate(a, [0, -1])));
    const shiftedPosB = add(posB, scale(length, rotate(a, [0, -1])));
    ctx.save();
    ctx.translate(...shiftedPosA);
    ctx.rotate(a);
    ctx.fillRect(0, 0, length, length);
    ctx.strokeRect(0, 0, length, length);
    ctx.restore();
    const randAngle =
        (Math.PI / 180) *
        (parseInt(minAngleInput.value) +
            Math.random() *
                (parseInt(maxAngleInput.value) - parseInt(minAngleInput.value)));
    const midPoint = scale(0.5, add(shiftedPosA, shiftedPosB));
    const trianglePos = add(
        midPoint,
        scale(length / 2, rotate(a + 2 * randAngle, [-1, 0]))
    );
    ctx.beginPath();
    ctx.moveTo(...shiftedPosA);
    ctx.lineTo(...trianglePos);
    ctx.lineTo(...shiftedPosB);
    ctx.fill();
    ctx.stroke();
    if (depth <= 1) {
        return;
    }
    setTimeout(() => {
        drawSquare(shiftedPosA, trianglePos, depth - 1);
        drawSquare(trianglePos, shiftedPosB, depth - 1);
    }, drawSpeed);
}

// execute main draw function

drawSquare(startPosA, startPosB, iterationInput.value);

// auxiliary math functions

function add(vec1, vec2) {
    return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}

function subtract(vec1, vec2) {
    return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}

function scale(u, vec) {
    return [u * vec[0], u * vec[1]];
}

function rotate(angle, vec) {
    return [
        Math.cos(angle) * vec[0] - Math.sin(angle) * vec[1],
        Math.cos(angle) * vec[1] + Math.sin(angle) * vec[0],
    ];
}

function distance(vec1, vec2) {
    return Math.sqrt(Math.pow(vec1[0] - vec2[0], 2) + Math.pow(vec1[1] - vec2[1], 2));
}

function angle(vec1, vec2) {
    return Math.atan2(vec2[1] - vec1[1], vec2[0] - vec1[0]);
}
