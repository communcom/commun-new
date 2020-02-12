import parse from 'url-parse';

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
