import { i18n } from 'shared/i18n';

import { dataSelector } from './common';

export const settingsSelector = path => dataSelector(['settings', ...path]);

export const currentLocaleSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'locale'])(state) || i18n.language
    ? i18n.language
    : 'en';
export const currentLocalesPostsSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'localesPosts'])(state) || i18n.language
    ? [i18n.language]
    : [];
export const currentCurrencyPostsSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'currencyPosts'])(state) || 'USD';
export const currencySelector = state =>
  dataSelector(['settings', 'user', 'basic', 'currency'])(state) || 'USD';
export const nsfwTypeSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'nsfw'])(state) || 'warn';
export const themeTypeSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'theme'])(state) || 'light';
export const isDarkThemeSelector = state => {
  const themeType = themeTypeSelector(state);

  if (
    themeType === 'dark' ||
    (process.browser &&
      themeType === 'system' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    return true;
  }

  return false;
};

export const isNsfwShowSelector = state => ['show'].includes(nsfwTypeSelector(state));
export const isNsfwAllowedSelector = state => ['show', 'warn'].includes(nsfwTypeSelector(state));

export const isShowCommentsInFeedSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'isShowCommentsInFeed'])(state) || false;

export const isHideEmptyBalancesSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'isHideEmptyBalances'])(state) || false;
