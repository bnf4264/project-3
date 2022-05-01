import Target from "./target.js";
import { getMouse, getRandom, goFullscreen } from './utilities.js';

let ctx;
let canvas;
let newTargetX;
let newTargetY;
let currentTargetClicked = true;
let targetsHit = 0;
let targetRadius = 30;
let percentAccuracy;
let totalClicks = 0;
let targets = [];

// Audio variables
let audioSelect = document.querySelector("#audio-select");
let currentAudio = new Audio('./audio/laser.mp4');
let shotgunAudio = new Audio('./audio/shotgun.mp4');
let laserAudio = new Audio('./audio/laser.mp4');
let alakablamAudio = new Audio('./audio/alakablam.mp4');
let audioPlaying = false;

// Difficulty Variables
let diffSelect = document.querySelector("#difficulty-select");
let currentDifficulty;

// Target Color Variables
let colorSelect = document.querySelector("#color-select");
let currentColor = "red";

window.onload = init;
function init() {
    //console.log("difficulty:", difficulty);
    canvas = document.querySelector('canvas');

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight-100;
    }
    resize()
    window.addEventListener('resize', resize);
    setupUI(canvas);
    createTarget();

    canvas.onmousedown = doMousedown;
    ctx = canvas.getContext('2d');
    //setupUI(canvas);
    update();
}

function setupUI(canvas) {
    // const fsButton = document.querySelector("#fsButton");

    // fsButton.onclick = e => {
    //     console.log("init called");
    //     clearCanvas();
    //     console.log("canvas cleared");
    //     goFullscreen(canvas);
    //     console.log("Target X: " + newTargetX + " Target Y: " + newTargetY);
    // }
}

function update() {
    requestAnimationFrame(update);
    //console.log("difficulty: ", currentDifficulty);
    diffSelect.onchange = e => {
        currentDifficulty = e.target.value;
        console.log("difficulty: ", currentDifficulty);
        if (currentDifficulty == "easy") {
            targetRadius = 30;
        }
        else if (currentDifficulty == "medium") {
            targetRadius = 20;
        }
        else {
            targetRadius = 10;
        }
    }

    // Clear canvas
    clearCanvas();

    // Update target display
    drawTargets();

    // Update text display
    ctx.font = '48px Serif';
    ctx.fillText('Targets Hit: ' + targetsHit, 10, 50);
    if(targetsHit == 0 && totalClicks > 0) ctx.fillText('Accuracy: ' + 0 + '%', 10, 90);
    else if(targetsHit != 0) ctx.fillText('Accuracy: ' + Math.trunc(targetsHit / totalClicks * 100) + '%', 10, 90);
    else ctx.fillText('Accuracy: ' + 100 + '%', 10, 90);
    

    audioSelect.onchange = e => {
        //console.log(e.target.value);
        currentAudio = new Audio(`./${e.target.value}`);
    }

    colorSelect.onchange = e => {
        currentColor = e.target.value;
    }
}

function createTarget() {
    newTargetX = getRandom(50, canvas.width - 50);
    newTargetY = getRandom(50, canvas.height - 50);
    let target = new Target(newTargetX, newTargetY, targetRadius);
    targets.push(target);
    console.log("new target");
    console.log("Target X: " + newTargetX + " Target Y: " + newTargetY);
}

function drawTargets() {
    for (let i = targets.length - 1; i >= 0; --i) {
        ctx.save();
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(targets[i].x, targets[i].y, targets[i].radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = currentColor;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = targets.length - 1; i >= 0; --i) {
        targets[i].radius = targetRadius;
    }
}

function doMousedown(e) {
    console.log(audioPlaying);
    totalClicks++;
    console.log(e);
    let mouse = getMouse(e);
    console.log(`canvas coordinates: x=${mouse.x} y=${mouse.y}`);
    playAudio();
    for (let i = targets.length - 1; i >= 0; --i) {
        let t = targets[i];
        if (t.containsPoint(mouse)) {
            console.log("target hit");
            targetsHit++;
            // remove target from target array
            targets.splice(i, 1);

            // Create new target
            createTarget();
        }
    }
}

function playAudio() {
    currentAudio.play();
}

