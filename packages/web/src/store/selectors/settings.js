import { dataSelector } from './common';

export const settingsSelector = path => dataSelector(['settings', ...path]);

export const currentLocaleSelector = dataSelector(['settings', 'basic', 'locale']);
export const nsfwTypeSelector = dataSelector(['settings', 'basic', 'nsfw']);
