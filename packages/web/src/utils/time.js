export class TimeoutError extends Error {
  constructor() {
    super('TimeoutError');
  }
}
// eslint-disable-next-line import/prefer-default-export
export function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function timeoutError(ms = 0) {
  return new Promise((_, reject) => setTimeout(() => reject(new TimeoutError()), ms));
}

export function secondsToDays(seconds) {
  return (seconds / 60 / 60 / 24).toFixed(1).replace(/\.0$/, '');
}
