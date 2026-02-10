import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

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
  .use(HttpBackend)
  .use(detector)
  .init({
    debug: true,
    fallbackLng: 'en',
    detection: {
      order: ['path', 'navigator'],
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export default i18next;
