export class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 80;
        this.mouse = { x: -1000, y: -1000 };
        this.explosions = [];
        this.time = 0;
        this.scrollOffset = 0;
        this.cachedThemeColor = this.getThemeColor();

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                baseX: Math.random() * this.canvas.width,
                baseY: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.02 + 0.005,
                angle: Math.random() * Math.PI * 2,
                color: this.getThemeColor()
            });
        }
    }

    getThemeColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0055ff';
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mousedown', (e) => {
            this.explosions.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                maxRadius: 300,
                life: 1.0, // 1.0 to 0.0
                decay: 0.02
            });
        });
        window.addEventListener('scroll', () => {
            this.scrollOffset = window.scrollY * 0.1;
        });

        window.addEventListener('themechanged', () => {
            this.cachedThemeColor = this.getThemeColor();
            this.particles.forEach(p => p.color = this.cachedThemeColor);
        });
    }

    animate() {
        this.time += 0.01;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw explosions (Damped oscillations simulation)
        this.explosions.forEach((exp, index) => {
            exp.radius += (exp.maxRadius - exp.radius) * 0.1;
            exp.life -= exp.decay;

            this.ctx.beginPath();
            this.ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `${this.cachedThemeColor}${Math.floor(exp.life * 255).toString(16).padStart(2, '0')}`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (exp.life <= 0) {
                this.explosions.splice(index, 1);
            }
        });

        this.particles.forEach(p => {
            // Perlin-like motion using multiple sine waves + scroll interaction
            const noiseX = Math.sin(this.time * p.speed * 10 + p.angle) * 50;
            const noiseY = Math.cos(this.time * p.speed * 8 + p.angle) * 50 - this.scrollOffset;

            let targetX = p.baseX + noiseX;
            let targetY = p.baseY + noiseY;

            // Mouse interaction (Repulsion)
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                targetX -= dx * force * 0.5;
                targetY -= dy * force * 0.5;
            }

            // Explosion interaction
            this.explosions.forEach(exp => {
                const edx = exp.x - p.x;
                const edy = exp.y - p.y;
                const edist = Math.sqrt(edx * edx + edy * edy);
                const diff = Math.abs(edist - exp.radius);
                if (diff < 20) {
                    const force = (20 - diff) / 20 * exp.life;
                    p.x -= edx / edist * force * 50;
                    p.y -= edy / edist * force * 50;
                }
            });

            // Smooth move towards target
            p.x += (targetX - p.x) * 0.05;
            p.y += (targetY - p.y) * 0.05;

            // Draw particle
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw connections (Constellation effect)
            this.particles.forEach(p2 => {
                const dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = p.color;
                    this.ctx.globalAlpha = 1 - (dist / 100);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}
