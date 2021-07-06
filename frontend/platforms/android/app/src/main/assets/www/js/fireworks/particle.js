/* inspired by https://codepen.io/whqet/pen/Auzch */
class Particle {
    constructor(startPosition, hue) {
        this.position = { x: startPosition.x, y: startPosition.y };
        this.alpha = 1;

        this.angle = Math.random() * Math.PI * 2;
        this.speed = this.randomrange(2, 7);
        this.hue = this.randomrange(hue - 50, hue + 50);
        this.brightness = this.randomrange(40, 80);
        this.fadeSpeed = this.randomrange(0.005, 0.012);

        this.friction = 0.97;
        this.gravity = 1;

        this.isAlive = true;

        this.coordinates = Array.from({ length: 5 }, () => [startPosition.x, startPosition.y]);
    }

    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.position.x, this.position.y]);

        this.speed *= this.friction;
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed + this.gravity;

        this.alpha -= this.fadeSpeed;

        if (this.alpha <= this.fadeSpeed) {
            this.isAlive = false;
        }
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.position.x, this.position.y);

        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 1;
        ctx.closePath();
        ctx.stroke();
    }

    randomrange(min, max) {
        return Math.random() * (max - min) + min; 
    }
}