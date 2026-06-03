export class Background {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'generative-bg';
        document.body.prepend(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.time = 0;
        this.mouse = { x: -1000, y: -1000 };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Initial particles
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.2,
                offset: Math.random() * 100
            });
        }

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    animate() {
        this.time += 0.01;
        const theme = document.documentElement.getAttribute('data-theme');
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent');

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (theme === 'theme-spiritual') {
            this.drawGrid();
        } else if (theme === 'theme-champloo') {
            this.drawNoise();
        } else {
            this.drawWaves(accent);
        }

        this.drawParticles(accent);

        requestAnimationFrame(() => this.animate());
    }

    drawWaves(color) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.1;

        for (let i = 0; i < 5; i++) {
            this.ctx.moveTo(0, this.height * 0.5 + i * 20);
            for (let x = 0; x < this.width; x += 10) {
                const y = Math.sin(x * 0.005 + this.time + i) * 50 +
                          Math.cos(x * 0.002 + this.time * 0.5) * 30;
                this.ctx.lineTo(x, this.height * 0.5 + y + i * 20);
            }
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }

    drawGrid() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
        this.ctx.lineWidth = 1;

        const size = 50;
        for (let x = 0; x < this.width; x += size) {
            for (let y = 0; y < this.height; y += size) {
                const dist = Math.hypot(x - this.mouse.x, y - this.mouse.y);
                const force = Math.max(0, (200 - dist) / 200);

                this.ctx.rect(x - 1 + force * 10, y - 1 + force * 10, 2, 2);
            }
        }
        this.ctx.stroke();
    }

    drawNoise() {
        // Red "glitch" static
        this.ctx.fillStyle = 'rgba(166, 53, 53, 0.02)';
        for (let i = 0; i < 100; i++) {
            this.ctx.fillRect(Math.random() * this.width, Math.random() * this.height, 1, 1);
        }
    }

    drawParticles(color) {
        this.ctx.fillStyle = color;
        this.particles.forEach(p => {
            const yOffset = Math.sin(this.time + p.offset) * 20;
            const xOffset = Math.cos(this.time + p.offset) * 20;

            const dist = Math.hypot(p.x + xOffset - this.mouse.x, p.y + yOffset - this.mouse.y);
            let opacity = 0.2;
            if (dist < 200) {
                opacity = 0.8 - (dist / 200);
            }

            this.ctx.globalAlpha = opacity;
            this.ctx.beginPath();
            this.ctx.arc(p.x + xOffset, p.y + yOffset, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
}
