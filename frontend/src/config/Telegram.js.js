import { init, miniApp, themeParams, backButton, hapticFeedback } from '@telegram-apps/sdk';

export function initTelegramApp() {
  try {
    // Inicializar el SDK
    init();

    // Montar componentes básicos si están disponibles
    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
      miniApp.setHeaderColor('#111827'); // Color de cabecera acorde a Tailwind (gray-900)
    }

    if (themeParams.mount.isAvailable()) {
      themeParams.mount();
    }
  } catch (error) {
    console.log("Ejecutándose fuera de Telegram (modo navegador web local de prueba).");
  }
}

// Funciones auxiliares de háptica para usar en los botones
export const triggerHaptic = (type = 'light') => {
  try {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred(type); // 'light', 'medium', 'heavy', etc.
    }
  } catch (e) {
    // Ignorar si no está en Telegram
  }
};