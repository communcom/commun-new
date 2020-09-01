/* eslint-disable import/prefer-default-export */

export function normalizeCyberwayErrorMessage(err) {
  if (!err || !err.message) {
    return 'Internal Error';
  }

  let { message } = err;

  if (err.data) {
    message = err.data.error?.details?.[0]?.message || 'Blockchain Error';
  }

  message = message.replace(/\n/g, ' ').trim();

  if (message.startsWith('duplicate transaction')) {
    return 'duplicate transaction';
  }

  const match = message.match(/^assertion failure with message: (.+)$/);
  if (match) {
    return match[1].trim();
  }

  return message;
}

export class DeclineError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeclineError';
  }
}

export class AbortError extends Error {
  constructor(message) {
    super(message || 'AbortError');

    // Возвращаем флаг enumerable обратно в true, чтобы JSON.stringify не отбрасывал это поле
    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: this.message,
    });
  }
}

export class DuplicateModalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateModalError';
  }
}

export function captureException(err, message) {
  if (process.browser && window.Sentry) {
    window.Sentry.captureException(err);
  }
  // eslint-disable-next-line no-console
  console.error(message, err);
}
