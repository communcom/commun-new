import { MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { resetCookies } from './cookies';

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
  resetCookies(['commun_invite_id', 'commun_oauth_identity']);
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
    return {};
  }

  // Если сохранение было на шаге сохранения pdf, то игнорируем состояние
  if (data && data.screenId === MASTER_KEY_SCREEN_ID) {
    removeRegistrationData();
    return {};
  }

  return data;
}

export function getData(keyName) {
  const json = localStorage.getItem(keyName);

  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Invalid json value for key "${keyName}":`, json);
  }

  return null;
}

export function getFieldValue(keyName, fieldName) {
  const data = getData(keyName);

  if (!data) {
    return undefined;
  }

  return data[fieldName];
}

export function setFieldValue(keyName, fieldName, value) {
  const data = getData(keyName) || {};

  data[fieldName] = value;

  localStorage.setItem(keyName, JSON.stringify(data));
}

export function mergeStateWith(keyName, values) {
  const data = {
    ...(getData(keyName) || {}),
    ...values,
  };

  localStorage.setItem(keyName, JSON.stringify(data));
}
