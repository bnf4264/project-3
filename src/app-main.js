let ctx;
let canvas;
let currentTargetX;
let currentTargetY;
let currentTargetClicked = true;
let targetsHit = 0;
let targetRadius = 20;
let percentAccuracy;
let totalClicks = 0;

window.onload = init;
function init(){
    canvas = document.querySelector('canvas');
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize()
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', e => {
        totalClicks++;
        clearCanvas();
        const xPos = e.clientX - canvas.getBoundingClientRect().left + targetRadius;
        const yPos = e.clientY - canvas.getBoundingClientRect().top;
        console.log(xPos);
        console.log(yPos);

        // Check if click is within 10 of the target position and if so hit it
        let distanceX = xPos - currentTargetX;
        let distanceY = yPos - currentTargetY;
        let distance = Math.sqrt((distanceX*distanceX) + (distanceY*distanceY));
        if(distance <= targetRadius * 1.25)
        {
            console.log("target hit");
            // Target hit
            currentTargetClicked = true;
            targetsHit++;
        }
    })
    ctx = canvas.getContext('2d');
    setupUI();
    update();
}

function update(){
    requestAnimationFrame(update);
    if(currentTargetClicked == true)
    {
        console.log("new target");
        currentTargetX = getRandomInt(50, canvas.width - 50);
        currentTargetY = getRandomInt(50, canvas.height - 50);
        console.log("Target X: " + currentTargetX + " Target Y: " + currentTargetY);
        currentTargetClicked = false;
    }
    drawTarget(ctx, currentTargetX, currentTargetY, targetRadius, "red", 1, "red", 0, Math.PI * 2);
   
    // Update text display
    ctx.font = '48px serif';
    ctx.fillText('Targets Hit: ' + targetsHit, 10, 50);
    ctx.fillText('Accuracy: ' + Math.trunc(targetsHit/totalClicks * 100) + '%', 10, 90);

    
    
}

function setupUI(){

}

function drawTarget(ctx,x,y,radius,fillStyle = "black", lineWidth = 0, strokeStyle = "black", startAngle = 0, endAngle = Math.PI * 2){
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, true);
    ctx.fill();
    if(lineWidth > 0)
    {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}