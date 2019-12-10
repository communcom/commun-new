import { MASTER_KEY_SCREEN_ID } from 'shared/constants';

const AUTH_KEY = 'authData';
export const REGISTRATION_KEY = 'communRegData';

export function saveAuth({ userId, username, activePrivateKey }) {
  const str = [userId, username, activePrivateKey].join(':');

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
    activePrivateKey: parts[2],
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

export function removeRegistrationData() {
  document.cookie = 'commun_invite_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  localStorage.removeItem(REGISTRATION_KEY);
}

export function getRegistrationData() {
  const json = localStorage.getItem(REGISTRATION_KEY);

  if (!json) {
    return {};
  }

  let data;

  try {
    data = JSON.parse(json);
  } catch {
    // Do nothing
  }

  // Если сохранение было на шаге сохранения pdf, то игнорируем состояние
  if (data && data.screenId === MASTER_KEY_SCREEN_ID) {
    removeRegistrationData();
    return {};
  }

  return {};
}
