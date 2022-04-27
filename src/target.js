export default class Target{
    constructor(x,y,radius)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    containsPoint(point){
        let distance = Math.sqrt(Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2));
        if(distance <= this.radius) return true;
    }
}