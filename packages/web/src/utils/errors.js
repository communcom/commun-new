/* eslint-disable import/prefer-default-export */

export function normalizeCyberwayErrorMessage(err) {
  if (!err || !err.message) {
    return 'Internal Error';
  }

  let { message } = err;

  message = message.replace(/\n/g, ' ').trim();

  const match = message.match(/^assertion failure with message: (.+)$/);

  if (match) {
    return match[1].trim();
  }

  return message;
}
