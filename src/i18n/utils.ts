// Import JSON files
import deTranslations from './locales/de.json';
import enTranslations from './locales/en.json';

export const defaultLang = 'de';
export const languages = {
  de: 'Deutsch',
  en: 'English',
};

const translations = {
  de: deTranslations,
  en: enTranslations,
};

export type Locale = keyof typeof translations;

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Locale;
  return defaultLang;
}

// Utility function to get nested translation values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

export function useTranslations(lang: Locale) {
  return function t(key: string): any {
    const translation = getNestedValue(translations[lang], key);
    if (translation !== key) return translation;

    const fallback = getNestedValue(translations[defaultLang], key);
    return fallback !== key ? fallback : key;
  };
}

export function getRouteFromUrl(url: URL): string {
  const [, lang, ...route] = url.pathname.split('/').filter(Boolean);
  if (lang in translations) {
    return route.join('/'); 
  }
  return [lang, ...route].join('/');
}

export function getLocalizedPath(currentPath: string, locale: Locale): string {
  const pathSegments = currentPath.replace(/^\/+/, '').split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const isLocaleInPath = firstSegment && firstSegment in translations;
  const pathWithoutLocale = isLocaleInPath ? pathSegments.slice(1) : pathSegments;
  const newPath = '/' + pathWithoutLocale.join('/');
  return locale === defaultLang ? newPath || '/' : `/${locale}${newPath}`;
}


