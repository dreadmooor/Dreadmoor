import { continueRender, delayRender } from 'remotion';

const GOOGLE_FONTS_HOST = 'https://fonts.googleapis.com';
const GOOGLE_FONTS_PATH = '/css2?family=Lalezar&family=Vazirmatn:wght@400;600;700;800&display=swap';

let fontsLoadPromise: Promise<void> | null = null;

export const ensurePersianFontsLoaded = async (): Promise<void> => {
  if (typeof document === 'undefined') {
    return;
  }

  if (!fontsLoadPromise) {
    fontsLoadPromise = (async () => {
      const existingLink = document.querySelector(
        `link[data-persian-fonts="true"]`
      ) as HTMLLinkElement | null;

      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${GOOGLE_FONTS_HOST}${GOOGLE_FONTS_PATH}`;
        link.setAttribute('data-persian-fonts', 'true');
        document.head.appendChild(link);
      }

      if ('fonts' in document && document.fonts?.ready) {
        await document.fonts.ready;
        await Promise.allSettled([
          document.fonts.load('400 48px "Lalezar"'),
          document.fonts.load('600 43px "Vazirmatn"'),
          document.fonts.load('700 34px "Vazirmatn"'),
          document.fonts.load('800 43px "Vazirmatn"'),
        ]);
      }
    })();
  }

  await fontsLoadPromise;
};

export const useWaitForPersianFonts = (): void => {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return;
  }

  const handle = delayRender('Loading Persian fonts (Lalezar & Vazirmatn)');
  ensurePersianFontsLoaded().finally(() => {
    continueRender(handle);
  });
};
