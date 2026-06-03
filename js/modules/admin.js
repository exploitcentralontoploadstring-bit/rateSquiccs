export class AdminPanel {
    constructor(dependencies) {
        this.themeManager = dependencies.themeManager;
        this.auth = dependencies.auth;
        this.subscription = dependencies.subscription;

        this.isOpen = false;
        this.init();
    }

    init() {
        this.createUI();
        this.addEventListeners();
    }

    createUI() {
        const adminTrigger = document.createElement('div');
        adminTrigger.className = 'admin-trigger';
        adminTrigger.innerHTML = '<span>[SYS]</span>';

        const panel = document.createElement('div');
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div class="admin-header">
                <h3>Engineer Overlay</h3>
                <button class="admin-close">&times;</button>
            </div>
            <div class="admin-body">
                <div class="admin-section">
                    <h4>Security Bypass</h4>
                    <button id="btn-force-login" class="admin-btn">Force Login</button>
                    <button id="btn-bypass-reg" class="admin-btn">Bypass Registration</button>
                </div>
                <div class="admin-section">
                    <h4>Theme Override</h4>
                    <div class="admin-theme-grid">
                        <button class="theme-override-btn" data-theme="day">Day</button>
                        <button class="theme-override-btn" data-theme="night">Night</button>
                        <button class="theme-override-btn" data-theme="sepia">Sepia</button>
                        <button class="theme-override-btn" data-theme="cyberpunk">Cyber</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(adminTrigger);
        document.body.appendChild(panel);

        this.panel = panel;
        this.trigger = adminTrigger;
    }

    addEventListeners() {
        this.trigger.addEventListener('click', () => this.togglePanel());
        this.panel.querySelector('.admin-close').addEventListener('click', () => this.togglePanel());

        // Bypass Logic
        this.panel.querySelector('#btn-force-login').addEventListener('click', () => this.forceLogin());
        this.panel.querySelector('#btn-bypass-reg').addEventListener('click', () => this.bypassRegistration());

        // Theme Overrides
        this.panel.querySelectorAll('.theme-override-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.themeManager.setTheme(btn.dataset.theme);
            });
        });
    }

    togglePanel() {
        this.isOpen = !this.isOpen;
        this.panel.classList.toggle('visible', this.isOpen);
        this.trigger.classList.toggle('active', this.isOpen);
    }

    forceLogin() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        const idInput = loginForm.querySelector('input[type="text"]');
        const passInput = loginForm.querySelector('input[type="password"]');

        if (idInput) idInput.value = "ADMIN_ALPHA";
        if (passInput) passInput.value = "KINETIC_PASS_99";

        this.showSuccess(loginForm, "Access Granted. Welcome, Architect.");
        this.togglePanel();
    }

    bypassRegistration() {
        const subForm = document.getElementById('subscription-form');
        if (!subForm) return;

        const email = document.getElementById('sub-email');
        const pass = document.getElementById('sub-password');
        const confirm = document.getElementById('sub-confirm');
        const card = document.getElementById('sub-card');

        if (email) email.value = "dev@hyper-real.io";
        if (pass) pass.value = "P@ssword123!";
        if (confirm) confirm.value = "P@ssword123!";
        if (card) card.value = "9999-9999-9999-9999";

        // Trigger mascot success state
        if (this.subscription) {
            this.subscription.updateMascot('strong');
            this.subscription.showWarning("Bypass Active: Elite Subscription Confirmed.");
        }

        this.showSuccess(subForm, "Neural link established.");
        this.togglePanel();
    }

    showSuccess(form, message) {
        form.innerHTML = `<div class="success-message">${message}</div>`;
        form.classList.add('authorized');

        // Trigger a global success effect (particles?)
        window.dispatchEvent(new CustomEvent('bypass-success'));
    }
}
