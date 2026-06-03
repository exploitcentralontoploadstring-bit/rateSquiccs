export class Hologram {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = 500;
        this.height = 500;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Unique seeds for this instance's generative shape
        this.seeds = Array.from({length: 12}, () => Math.random() * Math.PI * 2);

        // Advanced Polyhedron (Icosahedron-ish)
        const t = (1 + Math.sqrt(5)) / 2;
        this.vertices = [
            {x:-1, y: t, z: 0}, {x: 1, y: t, z: 0}, {x:-1, y:-t, z: 0}, {x: 1, y:-t, z: 0},
            {x: 0, y:-1, z: t}, {x: 0, y: 1, z: t}, {x: 0, y:-1, z:-t}, {x: 0, y: 1, z:-t},
            {x: t, y: 0, z:-1}, {x: t, y: 0, z: 1}, {x:-t, y: 0, z:-1}, {x:-t, y: 0, z: 1}
        ];

        this.edges = [];
        for(let i=0; i<this.vertices.length; i++) {
            for(let j=i+1; j<this.vertices.length; j++) {
                const d = Math.hypot(this.vertices[i].x - this.vertices[j].x, this.vertices[i].y - this.vertices[j].y, this.vertices[i].z - this.vertices[j].z);
                if(d < 2.1) this.edges.push([i, j]);
            }
        }

        this.angleX = 0;
        this.angleY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;

        this.setupEvents();
        this.animate();
    }

    setupEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
            this.mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
        });
    }

    rotate(v, ax, ay) {
        let x = v.x, y = v.y, z = v.z;
        let x1 = x * Math.cos(ay) + z * Math.sin(ay);
        let z1 = -x * Math.sin(ay) + z * Math.cos(ay);
        let y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
        let z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
        return { x: x1, y: y2, z: z2 };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time += 0.015;
        this.angleX += this.mouseY + 0.002;
        this.angleY += this.mouseX + 0.002;

        const theme = document.documentElement.getAttribute('data-theme');
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent');

        this.ctx.strokeStyle = accent;
        this.ctx.lineWidth = theme === 'theme-champloo' ? 2 : 1;

        if (theme === 'theme-spiritual') {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = accent;
        } else {
            this.ctx.shadowBlur = 0;
        }

        const projected = this.vertices.map((v, i) => {
            // Generative "Breathing" logic with unique seeds
            const pulse = Math.sin(this.time + this.seeds[i]) * 0.25;
            const dv = { x: v.x * (1 + pulse), y: v.y * (1 + pulse), z: v.z * (1 + pulse) };
            const rotated = this.rotate(dv, this.angleX, this.angleY);
            const scale = 140;
            const p = 600 / (600 + rotated.z * scale);
            return { x: rotated.x * scale * p + this.width / 2, y: rotated.y * scale * p + this.height / 2 };
        });

        this.ctx.beginPath();
        this.edges.forEach(edge => {
            const p1 = projected[edge[0]];
            const p2 = projected[edge[1]];
            this.ctx.moveTo(p1.x, p1.y);

            if (theme === 'theme-champloo') {
                this.ctx.lineTo(p2.x + (Math.random()-0.5)*3, p2.y + (Math.random()-0.5)*3);
            } else {
                this.ctx.lineTo(p2.x, p2.y);
            }
        });
        this.ctx.stroke();

        if (theme === 'theme-spiritual') {
            this.ctx.globalAlpha = 0.2;
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }

        requestAnimationFrame(() => this.animate());
    }
}
