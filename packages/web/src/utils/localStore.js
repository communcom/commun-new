const AUTH_KEY = 'authData';
export const REGISTRATION_KEY = 'communRegData';

export function saveAuth({ userId, username, privateKey }) {
  const str = [userId, username, privateKey].join(':');

  localStorage.setItem(AUTH_KEY, Buffer.from(str).toString('hex'));
}

export function getAuth() {
  const data = localStorage.getItem(AUTH_KEY);

  if (!data) {
    return null;
  }

  const parts = Buffer.from(data, 'hex')
    .toString()
    .split(':');

  if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) {
    return null;
  }

  return {
    userId: parts[0],
    username: parts[1],
    privateKey: parts[2],
  };
}

export function removeAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function setRegistrationData(data) {
  const regJson = localStorage.getItem(REGISTRATION_KEY);
  let previousData;

  if (regJson) {
    try {
      previousData = JSON.parse(regJson);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Invalid registration data:', regJson);
      previousData = {};
    }
  }

  localStorage.setItem(REGISTRATION_KEY, JSON.stringify({ ...previousData, ...data }));
}

export function getRegistrationData() {
  const data = localStorage.getItem(REGISTRATION_KEY);
  return data ? JSON.parse(data) : {};
}

export function removeRegistrationData() {
  localStorage.removeItem(REGISTRATION_KEY);
}
