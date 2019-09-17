const NextI18Next = require('next-i18next');

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/ru');

dayjs.extend(relativeTime);

const i18n = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['ru'],
  localePath: 'src/static/locales',
  detection: {
    caches: ['cookie'],
    cookieMinutes: 525600, // 1 year
  },
});

if (process.env.NODE_ENV === 'development' && process.browser) {
  window.dayjs = dayjs;
  // eslint-disable-next-line no-underscore-dangle
  window.__i18n = i18n;
}

module.exports = i18n;
