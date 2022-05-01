import Target from "./target.js";
import { getMouse, getRandom, goFullscreen } from './utilities.js';

let ctx, analyserNode, audioData;
let canvas;
let newTargetX;
let newTargetY;
let currentTargetClicked = true;
let targetsHit;
let targetRadius = 30;
let percentAccuracy;
let totalClicks;
let targets = [];
let time = 60;
let gameIsRunning = false;
let timer;

// Audio variables
let audioSelect = document.querySelector("#audio-select");
let currentAudio;
let shotgunAudio = new Audio('./audio/shotgun.mp4');
let laserAudio = new Audio('./audio/laser.mp4');
let alakablamAudio = new Audio('./audio/alakablam.mp4');
let audioPlaying = false;

// Difficulty Variables
let diffSelect = document.querySelector("#difficulty-select");
let currentDifficulty;

// Target Color Variables
let colorSelect = document.querySelector("#color-select");
let currentColor;

// Buttons
let playButton = document.querySelector("#playBtn");

window.onload = init;
function init() {
    //console.log("difficulty:", difficulty);
    canvas = document.querySelector('canvas');
    loadJsonFetch();

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

    playButton.onclick = playGame;
    update();
}

function loadJsonFetch(){
    const fetchPromise = async () => {
      // await ("stay on this line") until the first promise is resolved, meaning the data has downloaded
      let response = await fetch('./data/game-settings.json');

      // If the response is not successful, throw an error
      if(!response.ok){
        if(reponse.status == 404) console.log("Do 404 stuff!");
        throw new Error(`HTTP error! status: ${reponse.status}`);
      }

      // await ("stay on this line") until the second promise is resolved, meaning we now have a JSON object
      let json = await response.json();
      console.log(json);
      currentColor = json.targetColor;
      currentDifficulty = json.difficulty;
      currentAudio = new Audio(`./${json.clickSound}`);
    };

    // call fetchPromise() and add a .catch() to it
    // this works because fetchPromise() is async and thus returns a promise!
    fetchPromise()
    .catch(e=> {
      console.log(`In catch with e = ${e}`);
    });
};

function subtractFromTimer(){
    if(time != 0) time--;
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

function playGame(){
    window.scrollTo(0, document.body.scrollHeight);
    window.clearInterval(timer);
    time = 60;
    targetsHit = 0;
    totalClicks = 0;
    gameIsRunning = true;
    timer = window.setInterval(subtractFromTimer, 1000);
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

    audioSelect.onchange = e => {
        //console.log(e.target.value);
        currentAudio = new Audio(`./${e.target.value}`);
    }

    colorSelect.onchange = e => {
        currentColor = e.target.value;
    }

    // Active game loop
    if(gameIsRunning == true)
    {
        // Clear canvas
        clearCanvas();

        // Update target display
        drawTargets();

        // Update text display
        ctx.font = '48px Serif';
        ctx.fillText('Targets Hit: ' + targetsHit, 10, 50);
        if(targetsHit == 0 && totalClicks > 0) ctx.fillText('Accuracy: ' + 0 + '%', 10, 100);
        else if(targetsHit != 0) ctx.fillText('Accuracy: ' + Math.trunc(targetsHit / totalClicks * 100) + '%', 10, 100);
        else ctx.fillText('Accuracy: ' + 100 + '%', 10, 100);
        ctx.fillText('Timer: ' + time, 10, 150);

        // Check if game has ended
        if(time == 0)
        {
            gameIsRunning = false;
        }
    }

    // End Game Screen
    if(gameIsRunning == false && targetsHit)
    {
        // Clear canvas
        clearCanvas();
        ctx.font = '100px Serif';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width/2 - 250, canvas.height/2);
        ctx.font = '60px Serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Targets Hit: ' + targetsHit, canvas.width/2 - 250, canvas.height/2 + 100);
        ctx.fillText('Accuracy: ' + Math.trunc(targetsHit / totalClicks * 100) + '%', canvas.width/2 - 250, canvas.height/2 + 200);
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

