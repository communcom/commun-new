import { dataSelector } from './common';

export const settingsSelector = path => dataSelector(['settings', ...path]);

export const currentLocaleSelector = dataSelector(['settings', 'user', 'basic', 'locale']) || 'en';
export const nsfwTypeSelector = dataSelector(['settings', 'user', 'basic', 'nsfw']);

export const isNsfwShowSelector = state => ['show'].includes(nsfwTypeSelector(state));
export const isNsfwAllowedSelector = state => ['show', 'warn'].includes(nsfwTypeSelector(state));

export const isShowCommentsInFeedSelector = dataSelector([
  'settings',
  'user',
  'basic',
  'isShowCommentsInFeed',
]);
