import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translations
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import de from '@/locales/de.json';
import zh from '@/locales/zh.json';
import ja from '@/locales/ja.json';
import ko from '@/locales/ko.json';
import ar from '@/locales/ar.json';
import pt from '@/locales/pt.json';
import ru from '@/locales/ru.json';
import hi from '@/locales/hi.json';
import it from '@/locales/it.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  ar: { translation: ar },
  pt: { translation: pt },
  ru: { translation: ru },
  hi: { translation: hi },
  it: { translation: it },
};

// Get device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage,
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
