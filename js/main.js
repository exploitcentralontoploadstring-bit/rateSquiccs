import { ThemeManager } from './modules/theme.js';
import { ParticleSystem } from './modules/background.js';
import { AuthMorpher } from './modules/auth.js';
import { SubscriptionModule } from './modules/subscription.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme Manager
    const themeManager = new ThemeManager();

    // Initialize Generative Background
    const background = new ParticleSystem('bg-canvas');

    // Initialize Auth Morpher
    const auth = new AuthMorpher();

    // Initialize Subscription Module
    const subscription = new SubscriptionModule();
});
