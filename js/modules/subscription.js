export class Subscription {
    constructor() {
        this.form = document.getElementById('vinyl-form');
        this.cardInput = document.getElementById('card-input');
        this.passInput = document.getElementById('pass-input');
        this.mascot = document.getElementById('mascot-svg');

        if (this.form) this.init();
    }

    init() {
        // Card Masking
        this.cardInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            let masked = val.match(/.{1,4}/g)?.join('-') || val;
            e.target.value = masked.substring(0, 19);
        });

        // Mascot Logic
        this.passInput.addEventListener('focus', () => {
            this.mascot.classList.add('covering-eyes');
            const eyes = this.mascot.querySelectorAll('.eye');
            eyes.forEach(eye => eye.style.transform = 'translateY(10px) scaleY(0)');
        });

        this.passInput.addEventListener('blur', () => {
            this.mascot.classList.remove('covering-eyes');
            const eyes = this.mascot.querySelectorAll('.eye');
            eyes.forEach(eye => eye.style.transform = 'translateY(0) scaleY(1)');
        });

        this.passInput.addEventListener('input', () => {
            const val = this.passInput.value;
            const isStrong = val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val);
            const mouth = this.mascot.querySelector('.mouth');
            if (isStrong) {
                mouth.setAttribute('d', 'M 40 70 Q 50 80 60 70'); // Smile
            } else {
                mouth.setAttribute('d', 'M 40 70 Q 50 70 60 70'); // Neutral
            }
        });

        // Anti-Paste
        this.passInput.addEventListener('paste', (e) => {
            e.preventDefault();
            this.form.classList.add('error-shake');
            this.passInput.placeholder = "WRITE IT WITH SOUL, DON'T PASTE";
            setTimeout(() => this.form.classList.remove('error-shake'), 400);
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Order Transmitted to Seba Archive.");
        });
    }
}
