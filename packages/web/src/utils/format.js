// eslint-disable-next-line import/prefer-default-export
export function formatNumber(num) {
  const str = String(num);
  const results = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    if (i !== 0 && (str.length - i) % 3 === 0) {
      results.push(' ');
    }

    results.push(str.charAt(i));
  }

  return results.join('');
}
