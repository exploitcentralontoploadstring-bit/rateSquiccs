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

        // Geometry Definitions
        const t = (1 + Math.sqrt(5)) / 2;
        this.geometries = {
            icosahedron: [
                {x:-1, y: t, z: 0}, {x: 1, y: t, z: 0}, {x:-1, y:-t, z: 0}, {x: 1, y:-t, z: 0},
                {x: 0, y:-1, z: t}, {x: 0, y: 1, z: t}, {x: 0, y:-1, z:-t}, {x: 0, y: 1, z:-t},
                {x: t, y: 0, z:-1}, {x: t, y: 0, z: 1}, {x:-t, y: 0, z:-1}, {x:-t, y: 0, z: 1}
            ],
            cube: [
                {x:-1, y: 1, z: 1}, {x: 1, y: 1, z: 1}, {x:-1, y:-1, z: 1}, {x: 1, y:-1, z: 1},
                {x:-1, y: 1, z:-1}, {x: 1, y: 1, z:-1}, {x:-1, y:-1, z:-1}, {x: 1, y:-1, z:-1},
                {x: 0, y: 1.5, z: 0}, {x: 0, y: -1.5, z: 0}, {x: 1.5, y: 0, z: 0}, {x: -1.5, y: 0, z: 0}
            ],
            tetrahedron: [
                {x: 1, y: 1, z: 1}, {x:-1, y:-1, z: 1}, {x:-1, y: 1, z:-1}, {x: 1, y:-1, z:-1},
                {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}
            ]
        };

        this.vertices = this.geometries.icosahedron.map(v => ({...v}));
        this.targetVertices = this.geometries.icosahedron.map(v => ({...v}));

        this.edges = [];
        for(let i=0; i<12; i++) {
            for(let j=i+1; j<12; j++) {
                this.edges.push([i, j]); // Connect all for morph stability
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

        // Listen for theme changes to trigger morph
        const observer = new MutationObserver(() => this.handleThemeChange());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    handleThemeChange() {
        const theme = document.documentElement.getAttribute('data-theme');
        let nextGeo = 'icosahedron';
        if (theme === 'theme-metaphorical') nextGeo = 'tetrahedron';
        if (theme === 'theme-champloo') nextGeo = 'cube';
        if (theme === 'theme-spiritual') nextGeo = 'icosahedron';

        this.targetVertices = this.geometries[nextGeo].map(v => ({...v}));
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

        // Smooth Vertex Morphing
        this.vertices.forEach((v, i) => {
            const target = this.targetVertices[i];
            v.x += (target.x - v.x) * 0.05;
            v.y += (target.y - v.y) * 0.05;
            v.z += (target.z - v.z) * 0.05;
        });

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
            const pulse = Math.sin(this.time + this.seeds[i]) * 0.15;
            const dv = { x: v.x * (1 + pulse), y: v.y * (1 + pulse), z: v.z * (1 + pulse) };
            const rotated = this.rotate(dv, this.angleX, this.angleY);
            const scale = 120;
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
