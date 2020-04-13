const NextI18Next = require('next-i18next').default;

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const localizedFormat = require('dayjs/plugin/localizedFormat');

const env = require('./env');

const otherLanguages = ['en', 'ru'];
const fallbackLng = ['en', 'ru'];

if (env.HOST_ENV !== 'production') {
  otherLanguages.push('zh');
  fallbackLng.push('zh');
}

const i18n = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages,
  fallbackLng,
  localePath: process.browser ? 'locales' : './../../node_modules/commun-locales/locales',
  detection: {
    caches: ['cookie'],
    cookieMinutes: 525600, // 1 year
  },
});

const dayjsTwitter = require('./../utils/lib/dayjs-twitter')(i18n);
require('dayjs/locale/ru');
require('dayjs/locale/zh');

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(dayjsTwitter);

if (env.WEB_HOST_ENV !== 'production' && process.browser) {
  window.dayjs = dayjs;
  // eslint-disable-next-line no-underscore-dangle
  window.__i18n = i18n;
}

module.exports = i18n;
