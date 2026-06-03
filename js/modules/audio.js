export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.osc = null;
        this.gain = null;
        this.isPlaying = false;

        this.tracks = [
            "MODAL_SOUL_CORE", "METAPHORICAL_FLOW", "SPIRITUAL_STATE",
            "CHAMPLOO_VIBE", "HYDEOUT_SINE", "LUV_SIC_HEX",
            "ARUARIAN_DREAM", "FEATHER_LIGHT", "ETERNAL_NUJABES"
        ];
        this.currentIndex = 0;

        this.wheel = document.getElementById('music-wheel');
        this.playBtn = document.getElementById('play-trigger');
        this.nodes = document.querySelectorAll('.track-node');
        this.trackLabel = document.getElementById('current-track-name');

        this.init();
    }

    init() {
        if (!this.wheel) return;

        this.playBtn.onclick = (e) => {
            e.stopPropagation();
            this.togglePlay();
        };

        this.wheel.onclick = () => {
            this.currentIndex = (this.currentIndex + 1) % 9;
            this.updateWheel();
            if (this.isPlaying) this.updateSound();
        };

        // Initialize nodes
        this.nodes.forEach((node, idx) => {
            node.style.setProperty('--index', idx);
            if (idx === 0) node.classList.add('active');
        });
    }

    updateWheel() {
        const rotation = this.currentIndex * (360 / 9);
        this.wheel.style.transform = `rotate(${-rotation}deg)`;

        this.nodes.forEach((node, idx) => {
            node.classList.toggle('active', idx === this.currentIndex);
        });

        this.trackLabel.innerText = this.tracks[this.currentIndex];
    }

    togglePlay() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.setupSynth();
        }

        if (this.isPlaying) {
            this.ctx.suspend();
            this.playBtn.innerText = '▶';
        } else {
            this.ctx.resume();
            this.playBtn.innerText = '⏸';
            this.updateSound();
        }
        this.isPlaying = !this.isPlaying;
    }

    setupSynth() {
        this.osc = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();

        this.osc.type = 'sine';
        this.gain.gain.setValueAtTime(0.1, this.ctx.currentTime);

        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.osc.start();
    }

    updateSound() {
        if (!this.osc) return;
        // Map track index to frequency (pentatonic scale for "Zen" vibe)
        const freqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
        this.osc.frequency.setTargetAtTime(freqs[this.currentIndex], this.ctx.currentTime, 0.2);
    }
}
