export class ThemeManager {
    constructor() {
        this.themes = ['day', 'night', 'sepia', 'cyberpunk'];
        this.currentTheme = 'day';
        this.init();
    }

    init() {
        // Auto theme based on time
        const hour = new Date().getHours();
        if (hour < 6 || hour > 18) {
            this.setTheme('night');
        } else {
            this.setTheme('day');
        }

        this.createSwitcher();
    }

    setTheme(theme) {
        if (!this.themes.includes(theme)) return;
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('preferred-theme', theme);

        // Dispatch event for other components to react if needed
        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
    }

    createSwitcher() {
        const switcherContainer = document.createElement('div');
        switcherContainer.className = 'theme-switcher-container';

        // UI for switcher
        switcherContainer.innerHTML = `
            <div class="theme-toggle">
                ${this.themes.map(t => `
                    <button class="theme-btn" data-theme-id="${t}" title="${t.toUpperCase()} mode">
                        <span class="dot"></span>
                    </button>
                `).join('')}
                <div class="active-indicator"></div>
            </div>
        `;

        document.body.appendChild(switcherContainer);

        const buttons = switcherContainer.querySelectorAll('.theme-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTheme(btn.dataset.themeId);
                this.updateIndicator(btn);
            });
        });

        // Initial indicator position
        const activeBtn = Array.from(buttons).find(b => b.dataset.themeId === this.currentTheme);
        if (activeBtn) this.updateIndicator(activeBtn);
    }

    updateIndicator(button) {
        const indicator = document.querySelector('.active-indicator');
        if (indicator) {
            indicator.style.left = `${button.offsetLeft}px`;
            indicator.style.width = `${button.offsetWidth}px`;
        }
    }
}
