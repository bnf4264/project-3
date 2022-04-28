import Target from "./target.js";
import {getMouse, getRandom} from './utilities.js';

let ctx;
let canvas;
let newTargetX;
let newTargetY;
let currentTargetClicked = true;
let targetsHit = 0;
let targetRadius = 20;
let percentAccuracy;
let totalClicks = 0;
let targets = [];

// Audio variables
let audioSelect = document.querySelector("#audio-select");
let currentAudio = new Audio('./audio/shotgun.mp4');
let shotgunAudio = new Audio('./audio/shotgun.mp4');
let laserAudio = new Audio('./audio/laser.mp4');
let alakablamAudio = new Audio('./audio/alakablam.mp4');

window.onload = init;
function init(){
    //console.log("difficulty:", difficulty);
    canvas = document.querySelector('canvas');
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize()
    window.addEventListener('resize', resize);

    createTarget();

    canvas.onmousedown = doMousedown;
    ctx = canvas.getContext('2d');
    setupUI();
    update();
}

function update(){
    requestAnimationFrame(update);

    // Clear canvas
    clearCanvas();

    // Update target display
    drawTargets();
   
    // Update text display
    ctx.font = '48px serif';
    ctx.fillText('Targets Hit: ' + targetsHit, 10, 50);
    ctx.fillText('Accuracy: ' + Math.trunc(targetsHit/totalClicks * 100) + '%', 10, 90);

    audioSelect.onchange = e => {
        console.log(e.target.value);
        currentAudio = new Audio(`./${e.target.value}`);
    }
}

function setupUI(){

}

function createTarget(){
    newTargetX = getRandom(50, canvas.width - 50);
    newTargetY = getRandom(50, canvas.height - 50);
    let target = new Target(newTargetX, newTargetY, getRandom(10,30));
    targets.push(target);
    console.log("new target");
    console.log("Target X: " + newTargetX + " Target Y: " + newTargetY);
} 

function drawTargets(){
    for(let i = targets.length - 1; i >= 0; --i)
    {
        ctx.save();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(targets[i].x, targets[i].y, targets[i].radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function doMousedown(e){
    //shotgunAudio.play();
    //laserAudio.play();
    //alakablamAudio.play();
    currentAudio.play();
    totalClicks++;
    console.log(e);
    let mouse = getMouse(e);
    console.log(`canvas coordinates: x=${mouse.x} y=${mouse.y}`);

    for(let i = targets.length - 1; i >= 0; --i){
        let t = targets[i];
        if(t.containsPoint(mouse)){
            console.log("target hit");
            // shotgunAudio.play();
            targetsHit++;
            // remove target from target array
            targets.splice(i,1);

            // Create new target
            createTarget();
        }
    }
}