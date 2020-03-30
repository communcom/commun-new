const NextI18Next = require('next-i18next').default;

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const dayjsTwitter = require('./../utils/lib/dayjs-twitter');
require('dayjs/locale/ru');

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(dayjsTwitter);

const i18n = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['en', 'ru'],
  localePath: process.browser ? 'locales' : './../../node_modules/commun-locales/locales',
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
