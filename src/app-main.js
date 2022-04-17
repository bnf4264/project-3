let ctx;
let canvas;
window.onload = init;
function init(){
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    setupUI();
    update();
    drawTarget(ctx, 100, 100, 10, "red", 1, "red", 0, Math.PI * 2);
    console.log("init ran");
}

function update(){
    requestAnimationFrame(update);
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