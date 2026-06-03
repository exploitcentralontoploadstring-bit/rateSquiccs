export class AuthMorpher {
    constructor() {
        this.button = document.querySelector('.auth-submit-btn');
        this.svgPath = document.querySelector('.btn-morph-path');
        this.container = document.querySelector('.auth-container');
        this.parallaxLines = document.querySelectorAll('.parallax-line');
        if (!this.button || !this.svgPath) return;

        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.setupFormSubmit();
    }

    setupFormSubmit() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showSuccess(form, "Access Granted. Initializing Secure Session...");
        });
    }

    showSuccess(form, message) {
        form.innerHTML = `<div class="success-message">${message}</div>`;
        form.classList.add('authorized');

        // Custom warning (alert) used as notification
        const alert = document.createElement('div');
        alert.className = 'custom-alert visible';
        alert.textContent = "Welcome back, Architect.";
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    handleMouseMove(e) {
        const rect = this.button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = (e.clientX - centerX) / (window.innerWidth / 2);
        const dy = (e.clientY - centerY) / (window.innerHeight / 2);

        // Morph SVG path based on mouse proximity
        this.morphButton(dx, dy);

        // Parallax lines logic
        this.parallaxLines.forEach((line, i) => {
            const speed = (i + 1) * 0.02;
            const lx = dx * 50 * speed;
            const ly = dy * 50 * speed;
            line.style.transform = `translate(${lx}px, ${ly}px)`;
        });
    }

    morphButton(dx, dy) {
        // Base rectangular-ish path with organic curves that react to mouse
        const intensity = 15;
        const p1 = { x: 10 + dx * intensity, y: 10 + dy * intensity };
        const p2 = { x: 190 - dx * intensity, y: 10 - dy * intensity };
        const p3 = { x: 190 + dx * intensity, y: 50 + dy * intensity };
        const p4 = { x: 10 - dx * intensity, y: 50 - dy * intensity };

        const path = `M ${p1.x} ${p1.y} Q 100 ${10 + dy * intensity * 2} ${p2.x} ${p2.y} Q ${190 + dx * intensity * 2} 30 ${p3.x} ${p3.y} Q 100 ${50 - dy * intensity * 2} ${p4.x} ${p4.y} Q ${10 - dx * intensity * 2} 30 ${p1.x} ${p1.y} Z`;

        this.svgPath.setAttribute('d', path);
    }
}
