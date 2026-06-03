import { Hologram } from './modules/hologram.js';
import { Auth } from './modules/auth.js';
import { Subscription } from './modules/subscription.js';
import { Admin } from './modules/admin.js';
import { Slider } from './modules/slider.js';

class App {
    constructor() {
        this.pages = document.querySelectorAll('.page');
        this.currentPageIdx = 0;
        this.isTransitioning = false;

        this.init();
    }

    async init() {
        await this.runPreloader();
        this.setupNavigation();
        this.setupAudio();

        // Modules
        new Hologram('hologram-canvas');
        new Auth();
        new Subscription();
        new Admin();
        new Slider();

        window.app = this; // Global access for Admin panel
    }

    runPreloader() {
        return new Promise(resolve => {
            let count = 0;
            const counterEl = document.querySelector('.pre-counter');
            const interval = setInterval(() => {
                count += Math.floor(Math.random() * 15);
                if (count >= 100) {
                    count = 100;
                    clearInterval(interval);
                    document.getElementById('preloader').style.opacity = '0';
                    setTimeout(() => {
                        document.getElementById('preloader').style.display = 'none';
                        resolve();
                    }, 800);
                }
                counterEl.innerText = count.toString().padStart(2, '0');
            }, 50);
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = (e) => {
                const target = e.target.dataset.page;
                this.goToPage(target);
            };
        });
    }

    goToPage(pageId) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const nextPage = document.getElementById(pageId);
        const activePage = document.querySelector('.page.active');

        if (activePage === nextPage) {
            this.isTransitioning = false;
            return;
        }

        // 3D Flip Effect
        activePage.style.transform = 'rotateY(-90deg) scale(0.8)';
        activePage.style.opacity = '0';

        setTimeout(() => {
            activePage.classList.remove('active');
            activePage.style.transform = '';

            nextPage.classList.add('active');
            nextPage.style.transform = 'rotateY(90deg) scale(0.8)';
            nextPage.style.opacity = '0';

            requestAnimationFrame(() => {
                nextPage.style.transform = 'rotateY(0deg) scale(1)';
                nextPage.style.opacity = '1';
                this.isTransitioning = false;
            });
        }, 800);
    }

    setupAudio() {
        let audioCtx;
        const playBtn = document.getElementById('play-trigger');

        playBtn.onclick = () => {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();

                // Procedural Vinyl Noise (White noise + filtering)
                const bufferSize = 2 * audioCtx.sampleRate;
                const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = (Math.random() * 2 - 1) * 0.02; // Soft noise
                }

                const noise = audioCtx.createBufferSource();
                noise.buffer = noiseBuffer;
                noise.loop = true;

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 1000;

                noise.connect(filter);
                filter.connect(audioCtx.destination);
                noise.start();

                playBtn.innerText = '⏸';
            } else {
                if (audioCtx.state === 'running') {
                    audioCtx.suspend();
                    playBtn.innerText = '▶';
                } else {
                    audioCtx.resume();
                    playBtn.innerText = '⏸';
                }
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
