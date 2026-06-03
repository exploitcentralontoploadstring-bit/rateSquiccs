export class Hologram {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = 400;
        this.height = 400;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.points = [];
        this.angleX = 0;
        this.angleY = 0;
        this.mouseX = 0;
        this.mouseY = 0;

        this.initPoints();
        this.setupEvents();
        this.animate();
    }

    initPoints() {
        // Create a sphere of dots
        for (let i = 0; i < 400; i++) {
            let theta = Math.random() * 2 * Math.PI;
            let phi = Math.acos(Math.random() * 2 - 1);
            let r = 150;
            this.points.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi)
            });
        }
    }

    setupEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
            this.mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
        });
    }

    rotate(point, ax, ay) {
        // Rotate around Y axis
        let x1 = point.x * Math.cos(ay) + point.z * Math.sin(ay);
        let z1 = -point.x * Math.sin(ay) + point.z * Math.cos(ay);

        // Rotate around X axis
        let y2 = point.y * Math.cos(ax) - z1 * Math.sin(ax);
        let z2 = point.y * Math.sin(ax) + z1 * Math.cos(ax);

        return { x: x1, y: y2, z: z2 };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.angleX += this.mouseY;
        this.angleY += this.mouseX;

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'theme-modal-soul';
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

        this.ctx.fillStyle = accentColor;

        this.points.forEach(p => {
            let rotated = this.rotate(p, this.angleX, this.angleY);

            // Perspective projection
            let f = 400 / (400 + rotated.z);
            let sx = rotated.x * f + this.width / 2;
            let sy = rotated.y * f + this.height / 2;

            if (currentTheme === 'theme-spiritual') {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = accentColor;
            } else {
                this.ctx.shadowBlur = 0;
            }

            if (currentTheme === 'theme-champloo') {
                this.ctx.fillRect(sx, sy, 1, 4); // Brush-like strokes
            } else {
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, Math.max(0.5, 2 * f), 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}
