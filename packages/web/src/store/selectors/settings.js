import { dataSelector } from './common';

export const settingsSelector = path => dataSelector(['settings', ...path]);

export const currentLocaleSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'locale'])(state) || 'en';
export const currentLocalesPostsSelector = state =>
  dataSelector(['settings', 'user', 'basic', 'localesPosts'])(state) || [];
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

export const isShowCommentsInFeedSelector = dataSelector([
  'settings',
  'user',
  'basic',
  'isShowCommentsInFeed',
]);

export const isHideEmptyBalancesSelector = dataSelector([
  'settings',
  'user',
  'basic',
  'isHideEmptyBalances',
]);
