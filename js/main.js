import { ThemeManager } from './modules/theme.js';
import { ParticleSystem } from './modules/background.js';
import { AuthMorpher } from './modules/auth.js';
import { SubscriptionModule } from './modules/subscription.js';
import { AdminPanel } from './modules/admin.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme Manager
    const themeManager = new ThemeManager();

    // Initialize Generative Background
    const background = new ParticleSystem('bg-canvas');

    // Initialize Auth Morpher
    const auth = new AuthMorpher();

    // Initialize Subscription Module
    const subscription = new SubscriptionModule();

    // Initialize Admin Panel with dependencies
    const admin = new AdminPanel({
        themeManager,
        auth,
        subscription
    });
});
