import isNil from 'ramda/src/isNil';

export function resetCookies(cookies) {
  for (const cookie of cookies) {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
export function resetCookie(name) {
  resetCookies([name]);
}

/**
 * Set cookie
 * @param {string} name
 * @param {string} value
 * @param {number|string|Date|Object} [expiration]
 * @param {number} [expiration.days]
 * @param {number} [expiration.years]
 */
export function setCookie(name, value, expiration) {
  if (isNil(value)) {
    resetCookie(name);
    return;
  }

  let expPart = '';

  if (expiration) {
    let expiredDate;

    if (expiration.years) {
      expiredDate = new Date();
      expiredDate.setFullYear(expiredDate.getFullYear() + expiration.years);
    } else if (expiration.days) {
      expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + expiration.days);
    } else {
      expiredDate = new Date(expiration);
    }

    const expired = expiredDate.toGMTString();

    if (expired === 'Invalid Date') {
      throw new Error('Invalid expiration');
    }

    expPart = `; expires=${expired}`;
  }

  document.cookie = `${name}=${value}; path=/${expPart}`;
}
