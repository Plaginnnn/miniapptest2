interface ViewportEvent {
  isStateStable: boolean;
  height: number;
}

interface TelegramWebApp {
  viewportHeight: number;
  onEvent: (event: string, callback: (event: ViewportEvent) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
    MSStream?: any;
  }
}

export const fixIosViewport = (): void => {
  // Проверяем, является ли устройство iOS
  const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {

    const vh: number = window.Telegram?.WebApp?.viewportHeight || window.innerHeight;


    document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);

    // Добавляем слушатель для обновления высоты при изменении размера окна
    window.Telegram?.WebApp?.onEvent('viewportChanged', ({ isStateStable }: ViewportEvent) => {
      if (isStateStable) {
        const newVh: number = window.Telegram?.WebApp?.viewportHeight || window.innerHeight;
        document.documentElement.style.setProperty('--tg-viewport-height', `${newVh}px`);
      }
    });
  }
};
