/* eslint-disable import/prefer-default-export */

import getSlug from 'speakingurl';

export function defaults(data, defaultData) {
  if (!defaultData) {
    throw new Error('No default data');
  }

  const result = { ...data };

  for (const keyName of Object.keys(defaultData)) {
    if (result[keyName] === undefined) {
      result[keyName] = defaultData[keyName];
    }
  }

  return result;
}

export function asyncTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 })
    .replace(/_/g, '-')
    .replace(/-{2,}/g, '-');
}

export function getPostPermlink(title) {
  return slug(`${title ? `${title}-` : ''}${Math.floor(Date.now() / 1000)}`, {
    lower: true,
  });
}

export function getCommentPermlink(contentId) {
  // Удаляем часть с timestamp родительской ссылки
  const parentPermlink = contentId.permlink.replace(/-\d+$/, '');

  return `re-${parentPermlink}-${Math.floor(Date.now() / 1000)}`;
}

export function multiArgsMemoize(func) {
  let lastCallArgs;
  let savedResults;

  return (...args) => {
    if (lastCallArgs && lastCallArgs.length === args.length) {
      let isSameArgs = true;

      for (let i = 0; i < args.length; i += 1) {
        if (args[i] !== lastCallArgs[i]) {
          isSameArgs = false;
          break;
        }
      }

      if (isSameArgs) {
        return savedResults;
      }
    }

    savedResults = func(...args);
    lastCallArgs = args;

    return savedResults;
  };
}
