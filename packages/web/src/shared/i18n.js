const NextI18Next = require('next-i18next').default;
const env = require('shared/env');

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const dayjsTwitter = require('./../utils/lib/dayjs-twitter');
require('dayjs/locale/ru');

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(dayjsTwitter);

const otherLanguages = ['en'];

if (env.WEB_HOST_ENV !== 'production') {
  otherLanguages.push('ru');
}

const i18n = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages,
  localePath: process.browser ? 'locales' : './../../node_modules/commun-locales/locales',
  detection: {
    caches: ['cookie'],
    cookieMinutes: 525600, // 1 year
  },
});

if (env.WEB_HOST_ENV !== 'production' && process.browser) {
  window.dayjs = dayjs;
  // eslint-disable-next-line no-underscore-dangle
  window.__i18n = i18n;
}

module.exports = i18n;
