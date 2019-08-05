const { ipcRenderer } = require('electron');

document.addEventListener("DOMContentLoaded", start);
window.resizeTo(350, 200);

function start() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const leftEye = new Eye({ x:100, y:100});
    const rightEye = new Eye({ x:250, y:100});
    document.body.appendChild(canvas);
    const draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        leftEye.draw(context);
        rightEye.draw(context);
        window.requestAnimationFrame(draw);
    };
    draw();

    ipcRenderer.on("mousemove", (_, pos) => {
        let {x, y} = pos;

        const offsetX = window.outerWidth - window.innerWidth;
        const offsetY = window.outerHeight - window.innerHeight;
        x -= window.screenX + offsetX;
        y -= window.screenY + offsetY;

        leftEye.moveBall({x, y});
        rightEye.moveBall({x, y});
    });
}

class Eye {
    constructor({ x, y, radX = 50, radY = 75, border = 10}) {
        this.x = x;
        this.y = y;
        this.screenX = window.screenX;
        this.screenY = window.screenY;
        this.radX = radX;
        this.radY = radY;
        this.border = border;
        this.ball = new Ball({center:{x, y}, radius: 10})
        this.offset = this.border + this.ball.radius;
    }
    draw(context) {
        const { x, y, radX, radY, border} = this;
        context.save();
        context.strokeStyle = "#000000";
        context.fillStyle = "#fff";
        context.lineWidth = border;
        context.beginPath();
        context.ellipse(x, y, radX, radY, 0, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.restore();
        this.ball.draw(context);
    }
    contains(center) {
        const curX = center.x - this.x;
        const curY = center.y - this.y;
        const radX = this.radX - this.offset;
        const radY = this.radY - this.offset;
        return (curX/radX)**2 + (curY/radY)**2 < 1;
    }
    moveBall(center) {
        if (!this.contains(center)) {
            const alpha = Math.atan2(center.y - this.y, center.x - this.x);
            center.x = this.x + (this.radX - this.offset) * Math.cos(alpha);
            center.y = this.y + (this.radY - this.offset) * Math.sin(alpha); 
        }
        this.ball.center = center;
    }
}

class Ball {
    constructor({ center, radius = 5}) {
        this.center = center;
        this.radius = radius;
    }

    draw(context) {
        const { center, radius } = this;
        context.save();
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    }
}