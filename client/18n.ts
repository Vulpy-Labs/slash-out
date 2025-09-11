import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';

const pathDetector = {
  name: 'path',
  lookup() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[1];
  },
};

const detector = new LanguageDetector();
detector.addDetector(pathDetector);

i18next
  .use(I18NextHttpBackend)
  .use(detector)
  .init({
    fallbackLng: 'en',
    debug: true,
    detection: {
      order: ['path', 'navigator'],
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export default i18next;
