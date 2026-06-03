export class Admin {
    constructor() {
        this.trigger = document.getElementById('dev-trigger');
        this.panel = document.getElementById('dev-panel');
        if (!this.trigger) return;

        this.trigger.onclick = () => {
            this.panel.style.display = this.panel.style.display === 'block' ? 'none' : 'block';
        };

        this.setupActions();
    }

    setupActions() {
        document.getElementById('bypass-auth').onclick = () => {
            alert("SYS: Auth Bypassed. Accessing Modal Soul.");
            window.app.goToPage('p1');
        };

        document.getElementById('force-fill').onclick = () => {
            const email = document.getElementById('email-input');
            const card = document.getElementById('card-input');
            const pass = document.getElementById('pass-input');
            if (email) email.value = "seba.tribute@nujabes.io";
            if (card) card.value = "4444-4444-4444-4444";
            if (pass) pass.value = "ModalSoul2024!";

            // Trigger mascot logic
            pass.dispatchEvent(new Event('input'));

            // Auto Submit
            setTimeout(() => {
                const form = document.getElementById('vinyl-form');
                if (form) form.dispatchEvent(new Event('submit'));
            }, 500);
        };

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.onclick = () => {
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
            };
        });
    }
}
