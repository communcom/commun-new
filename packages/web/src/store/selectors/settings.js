import { dataSelector } from './common';

export const currentLocaleSelector = dataSelector(['settings', 'basic', 'locale']);
export const nsfwTypeSelector = dataSelector(['settings', 'basic', 'nsfw']);
export const notificationsSelector = dataSelector(['settings', 'notify', 'show']);
