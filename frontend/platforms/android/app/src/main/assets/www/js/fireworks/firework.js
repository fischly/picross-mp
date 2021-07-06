/* inspired by https://codepen.io/whqet/pen/Auzch */

class Firework {
    constructor(startPosition, endPosition, hue) {
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.currentPosition = { x: this.startPosition.x, y: this.startPosition.y };

        this.direction = this.calculateDirection(this.startPosition, this.endPosition);
        this.angle = Math.atan2(this.direction.y, this.direction.x) + Math.PI / 2;
        this.totalDistance = this.calculateDistance(this.startPosition, this.endPosition);

        this.isMoving = true;
        this.isExploding = false;
        this.isAlive = true;

        this.speed = 0;
        this.acceleration = 0.5;

        this.particles = [];

        this.hue = hue;
    }

    update(delta) {
        if (this.isMoving) {
            this.speed += this.acceleration;
            this.currentPosition.x = this.currentPosition.x + this.speed * this.direction.x;
            this.currentPosition.y = this.currentPosition.y + this.speed * this.direction.y;

            const distanceTraveled = this.calculateDistance(this.startPosition, this.currentPosition);

            if (distanceTraveled >= this.totalDistance) {
                this.isMoving = false;
                this.isExploding = true;

                this.explode();
            }
        }

        if (this.isAlive && this.isExploding && this.particles.length <= 0) {
            this.isAlive = false;
        }
    }

    draw(ctx) {
        if (!this.isExploding) {
            ctx.beginPath();
            ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
            ctx.ellipse(this.currentPosition.x, this.currentPosition.y, 1, 10, this.angle, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        if (this.isExploding) {
            // update all praticles
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.update();
                p.draw(ctx);

                if (!p.isAlive) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }

    explode() {
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.currentPosition, this.hue));
        }
    }


    calculateDirection(start, end) {
        const diff = { x: end.x - start.x, y: end.y - start.y };
        const diffLen = Math.sqrt(diff.x ** 2 + diff.y ** 2);

        return { x: diff.x / diffLen, y: diff.y / diffLen };
    }

    calculateDistance(start, end) {
        const diff = { x: end.x - start.x, y: end.y - start.y };

        return Math.sqrt(diff.x ** 2 + diff.y ** 2);
    }
}