import { Hologram } from './modules/hologram.js';
import { Auth } from './modules/auth.js';
import { Cursor } from './modules/cursor.js';
import { AudioEngine } from './modules/audio.js';
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

        // Modules
        new Cursor('cursor-canvas');
        new AudioEngine();
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

        // Background Interaction & Scroll Parallax
        const a3d = document.querySelector('.a3d');
        const povScale = document.querySelector('.pov-scale');
        const povPan = document.querySelector('.pov-pan');
        const focalPoint = document.querySelector('.focal-point');
        const paths = document.querySelectorAll('.motion-paths path');

        // Simple smoothing
        let scrollY = 0;
        let lerpY = 0;

        window.addEventListener('wheel', (e) => {
            scrollY += e.deltaY * 0.5;
            scrollY = Math.max(0, Math.min(scrollY, 5000));
        });

        const updateBG = () => {
            lerpY += (scrollY - lerpY) * 0.1;
            const progress = (lerpY / 5000); // 0 to 1

            // 1. 3D Scene Rotation
            if (a3d) a3d.style.transform = `rotateY(${lerpY * 0.05}deg) translateZ(${Math.sin(progress * Math.PI) * 200}px)`;

            // 2. SVG Motion Path (Manual Path calculation for pure JS)
            if (paths.length > 0 && focalPoint) {
                const pathIdx = Math.min(Math.floor(progress * paths.length), paths.length - 1);
                const pathProgress = (progress * paths.length) % 1;
                const path = paths[pathIdx];
                const len = path.getTotalLength();
                const pt = path.getPointAtLength(len * pathProgress);

                // Focal Point following
                focalPoint.setAttribute('cx', pt.x);
                focalPoint.setAttribute('cy', pt.y);

                // POV Pan (Inverted Focal Point)
                if (povPan) {
                    povPan.style.transform = `translate(${-pt.x}px, ${-pt.y}px)`;
                }

                // POV Scale/Rotation
                if (povScale) {
                    const scale = 3.2 - (progress * 1.2);
                    const rotate = 20 - (progress * 25);
                    povScale.style.transform = `translate(500px, 500px) scale(${scale}) rotate(${rotate}deg)`;
                    povScale.style.transformOrigin = '0 0';
                }
            }

            requestAnimationFrame(updateBG);
        };
        updateBG();
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
}

document.addEventListener('DOMContentLoaded', () => new App());
