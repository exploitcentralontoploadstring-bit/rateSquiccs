export class SubscriptionModule {
    constructor() {
        this.form = document.getElementById('subscription-form');
        this.emailInput = document.getElementById('sub-email');
        this.cardInput = document.getElementById('sub-card');
        this.passwordInput = document.getElementById('sub-password');
        this.confirmPasswordInput = document.getElementById('sub-confirm');
        this.mascot = document.querySelector('.mascot-container');

        this.placeholders = [
            "Your digital soul's address",
            "Where do we send the future?",
            "Identify yourself",
            "Email, please. No spam, pinky promise."
        ];

        if (!this.form) return;
        this.init();
    }

    init() {
        this.setupMasks();
        this.setupMascotLogic();
        this.setupAntiCopyPaste();
        this.randomizePlaceholders();
        this.setupFormSubmit();
    }

    setupFormSubmit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.emailInput.value)) {
                this.showWarning("Invalid neural address.");
                return;
            }

            if (this.passwordInput.value !== this.confirmPasswordInput.value) {
                this.showWarning("Keys do not match. Synchronization failed.");
                return;
            }

            this.showWarning("Subscription Processed. Welcome to the elite.");
            this.form.innerHTML = '<div class="success-message">Link established. Check your terminal.</div>';
        });
    }

    setupMasks() {
        this.cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = '';
            for (let i = 0; i < value.length && i < 16; i++) {
                if (i > 0 && i % 4 === 0) formatted += '-';
                formatted += value[i];
            }
            e.target.value = formatted;
        });
    }

    setupMascotLogic() {
        this.passwordInput.addEventListener('input', (e) => {
            const strength = this.checkPasswordStrength(e.target.value);
            this.updateMascot(strength);
        });

        this.passwordInput.addEventListener('focus', () => {
            this.mascot.classList.add('peeking');
        });

        this.passwordInput.addEventListener('blur', () => {
            this.mascot.classList.remove('peeking');
        });
    }

    checkPasswordStrength(pass) {
        if (pass.length === 0) return 'none';
        if (pass.length < 6) return 'weak';
        if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) return 'strong';
        return 'medium';
    }

    updateMascot(strength) {
        const mascotEye = document.querySelector('.mascot-eye-pupil');
        const mascotMouth = document.querySelector('.mascot-mouth');

        if (strength === 'strong') {
            this.mascot.classList.add('impressed');
            if (mascotMouth) mascotMouth.setAttribute('d', 'M 40 70 Q 50 85 60 70');
        } else {
            this.mascot.classList.remove('impressed');
            if (mascotMouth) mascotMouth.setAttribute('d', 'M 40 75 Q 50 75 60 75');
        }
    }

    setupAntiCopyPaste() {
        this.confirmPasswordInput.addEventListener('paste', (e) => {
            e.preventDefault();
            this.showWarning("Nice try, human. Type it yourself for better muscle memory.");
            this.randomizePlaceholders();
            this.confirmPasswordInput.classList.add('shake');
            setTimeout(() => this.confirmPasswordInput.classList.remove('shake'), 500);
        });
    }

    randomizePlaceholders() {
        const inputs = [this.emailInput, this.cardInput, this.passwordInput, this.confirmPasswordInput];
        inputs.forEach(input => {
            if (input) {
                const randomText = this.placeholders[Math.floor(Math.random() * this.placeholders.length)];
                input.placeholder = randomText;
            }
        });
    }

    showWarning(msg) {
        const warning = document.createElement('div');
        warning.className = 'custom-alert';
        warning.textContent = msg;
        document.body.appendChild(warning);
        setTimeout(() => warning.classList.add('visible'), 10);
        setTimeout(() => {
            warning.classList.remove('visible');
            setTimeout(() => warning.remove(), 500);
        }, 3000);
    }
}
