/* eslint-disable no-param-reassign,import/prefer-default-export */

export function smartTrim(text, limit, allowSoftTrim = false) {
  if (!text) {
    return '';
  }

  if (text.length <= limit) {
    return text;
  }

  text = text.substring(0, limit).trim();

  if (text.split(' ').length === 1) {
    return `${text}…`;
  }

  if (allowSoftTrim) {
    const dotIndex = text.lastIndexOf('. ');
    const softLimit = Math.round(limit * 0.86);

    // If dot near end of characters limit
    if (dotIndex > softLimit) {
      return text.substring(0, dotIndex + 1);
    }
  }

  // Truncate, remove the last (likely partial) word (along with random punctuation), and add ellipses
  return text.replace(/[,!?]?\s+[^\s]+$/, '…');
}
