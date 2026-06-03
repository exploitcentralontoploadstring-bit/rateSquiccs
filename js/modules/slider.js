export class Slider {
    constructor() {
        this.container = document.querySelector('.slider-container');
        this.slides = document.querySelectorAll('.slide');
        if (!this.container || this.slides.length === 0) return;

        this.currentIdx = 0;
        this.init();
    }

    init() {
        // Auto-slide every 5 seconds
        setInterval(() => {
            this.next();
        }, 5000);

        // Add click interaction
        this.container.addEventListener('click', () => this.next());
    }

    next() {
        this.slides[this.currentIdx].classList.remove('active');
        this.currentIdx = (this.currentIdx + 1) % this.slides.length;
        this.slides[this.currentIdx].classList.add('active');
    }
}
