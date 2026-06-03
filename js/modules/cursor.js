export class Cursor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.points = [];
        this.maxPoints = 20;
        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };

        this.colors = ["#f967fb", "#53bc28", "#6958d5"]; // From user sample
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Easing for smooth follow
        this.lastMouse.x += (this.mouse.x - this.lastMouse.x) * 0.2;
        this.lastMouse.y += (this.mouse.y - this.lastMouse.y) * 0.2;

        // Add point
        this.points.push({ x: this.lastMouse.x, y: this.lastMouse.y });
        if (this.points.length > this.maxPoints) this.points.shift();

        if (this.points.length > 1) {
            this.drawTubes();
        }

        requestAnimationFrame(() => this.animate());
    }

    drawTubes() {
        const theme = document.documentElement.getAttribute('data-theme');
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent');

        this.ctx.shadowBlur = 10;

        // Draw multiple layers for "tube" effect
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.lineWidth = (3 - i) * 3;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            // Use user-provided colors or theme accent
            const color = i === 0 ? accent : this.colors[i-1];
            this.ctx.strokeStyle = color;
            this.ctx.shadowColor = color;
            this.ctx.globalAlpha = 0.4 / (i + 1);

            this.ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let j = 1; j < this.points.length; j++) {
                const xc = (this.points[j].x + this.points[j - 1].x) / 2;
                const yc = (this.points[j].y + this.points[j - 1].y) / 2;
                this.ctx.quadraticCurveTo(this.points[j - 1].x, this.points[j - 1].y, xc, yc);
            }
            this.ctx.stroke();
        }
        this.ctx.shadowBlur = 0;
    }
}
