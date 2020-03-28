import { dataSelector } from './common';

export const settingsSelector = path => dataSelector(['settings', ...path]);

export const currentLocaleSelector = dataSelector(['settings', 'user', 'basic', 'locale']) || 'en';
export const nsfwTypeSelector = dataSelector(['settings', 'user', 'basic', 'nsfw']);
