import { dataSelector } from './common';

export const settingsSelector = path => dataSelector(['settings', ...path]);

export const currentLocaleSelector = dataSelector(['settings', 'user', 'basic', 'locale']) || 'en';
export const currentLocalesPostsSelector =
  dataSelector(['settings', 'user', 'basic', 'localesPosts']) || [];
export const currencySelector = dataSelector(['settings', 'user', 'basic', 'currency']) || 'USD';
export const nsfwTypeSelector = dataSelector(['settings', 'user', 'basic', 'nsfw']) || 'warn';
export const themeTypeSelector = dataSelector(['settings', 'user', 'basic', 'theme']) || 'light';
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
