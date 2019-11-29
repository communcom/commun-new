// eslint-disable-next-line import/prefer-default-export
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
