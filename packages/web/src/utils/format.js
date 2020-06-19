import parse from 'url-parse';

import { i18n } from 'shared/i18n';

export function formatMoney(value, currency = 'CMN') {
  if (currency !== 'CMN') {
    return Intl.NumberFormat('en', {
      style: 'currency',
      currency,
    }).format(value);
  }

  const str = String(value);
  const [beforeComma, afterComma] = str.split('.');

  const results = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < beforeComma.length; i++) {
    if (i !== 0 && (beforeComma.length - i) % 3 === 0) {
      results.push(' ');
    }

    results.push(beforeComma.charAt(i));
  }

  const resultString = results.join('');
  return afterComma ? `${resultString}.${afterComma.slice(0, 4)}` : resultString;
}

export function formatNumber(num) {
  const str = String(num);
  const [beforeComma, afterComma] = str.split('.');

  const results = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < beforeComma.length; i++) {
    if (i !== 0 && (beforeComma.length - i) % 3 === 0) {
      results.push(' ');
    }

    results.push(beforeComma.charAt(i));
  }
  const resultString = results.join('');
  return afterComma ? `${resultString}.${afterComma}` : resultString;
}

export function getWebsiteHostname(linkString) {
  const url = parse(linkString, true);

  return url.hostname;
}

export function humanizeFileSize(fileSize) {
  if (fileSize < 1024) {
    return `${fileSize} bytes`;
  }

  if (fileSize < 1024 * 1024) {
    const fixed = Math.ceil(fileSize / 1024);

    return `${fixed} KB`;
  }

  if (fileSize < 10 * 1024 * 1024) {
    const mb = fileSize / 1024 / 1024;
    const str = mb.toFixed(1).replace(/\.0$/, '');

    return `${str} MB`;
  }

  return `${Math.round(fileSize / 1024 / 1024)} MB`;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export function normalizeTime(timestamp) {
  const date = new Date(timestamp);
  const delta = Date.now() - date;

  if (delta >= 0) {
    if (delta < MINUTE) {
      return i18n.t('utils.normalize_time.now');
    }

    if (delta < HOUR) {
      return `${Math.round(delta / MINUTE)}${i18n.t('utils.normalize_time.m_ago')}`;
    }

    if (delta < 23.5 * HOUR) {
      return `${Math.round(delta / HOUR)}${i18n.t('utils.normalize_time.h_ago')}`;
    }
  }

  return date.toLocaleString();
}
