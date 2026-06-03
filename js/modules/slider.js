export class Slider {
    constructor() {
        this.container = document.querySelector('.slider-container');
        this.slides = document.querySelectorAll('.slide');
        this.navTriggers = document.querySelectorAll('.nav-link[data-page="p2"], .slider-container');

        if (!this.container || this.slides.length === 0) return;

        this.currentIdx = 0;
        this.scrubInterval = null;
        this.init();
    }

    init() {
        // Hover-Scrubbing Logic
        this.navTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => this.startScrubbing());
            trigger.addEventListener('mouseleave', () => this.stopScrubbing());
        });
    }

    startScrubbing() {
        if (this.scrubInterval) return;
        this.scrubInterval = setInterval(() => {
            this.next();
        }, 150); // High frequency cycles
    }

    stopScrubbing() {
        clearInterval(this.scrubInterval);
        this.scrubInterval = null;

        // Auto-fix layout to the current item
        const activeAlbum = this.slides[this.currentIdx].dataset.album || "Modal Soul";
        console.log(`[SYS] Scrub fixed on: ${activeAlbum}`);
    }

    next() {
        this.slides[this.currentIdx].classList.remove('active');
        this.currentIdx = (this.currentIdx + 1) % this.slides.length;
        this.slides[this.currentIdx].classList.add('active');
    }
}
