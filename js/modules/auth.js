export class Auth {
    constructor() {
        this.btn = document.getElementById('morph-btn');
        this.path = document.getElementById('morph-path');
        if (!this.btn || !this.path) return;

        this.initMorph();
    }

    initMorph() {
        this.btn.addEventListener('mousemove', (e) => {
            const rect = this.btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Warp the SVG path based on mouse position
            const distortion = 15;
            const dx = (x / rect.width - 0.5) * distortion;
            const dy = (y / rect.height - 0.5) * distortion;

            this.path.setAttribute('d', `M 0 0 Q ${100 + dx} ${dy} 200 0 L 200 60 Q ${100 - dx} ${60 + dy} 0 60 Z`);
        });

        this.btn.addEventListener('mouseleave', () => {
            // Reset to rectangle
            this.path.setAttribute('d', 'M 0 0 Q 100 0 200 0 L 200 60 Q 100 60 0 60 Z');
        });
    }
}
