/* eslint-disable no-shadow,prefer-destructuring */

import commun from 'commun-client';
import { sign } from 'commun-client/lib/auth';

import { saveAuth, removeAuth } from 'utils/localStore';
import { fetchProfile } from 'store/actions/gate/user';
import { fetchSettings } from 'store/actions/gate/settings';
import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
  SET_SERVER_ACCOUNT_NAME,
  GATE_AUTHORIZE_SECRET,
  GATE_AUTHORIZE_SECRET_SUCCESS,
  GATE_AUTHORIZE_SECRET_ERROR,
  GATE_AUTHORIZE,
  GATE_AUTHORIZE_SUCCESS,
  GATE_AUTHORIZE_ERROR,
} from 'store/constants';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { resolveProfile } from 'store/actions/gate/content';

export const setServerAccountName = userId => ({
  type: SET_SERVER_ACCOUNT_NAME,
  payload: {
    userId,
  },
});

const getAuthSecret = () => ({
  [CALL_GATE]: {
    types: [GATE_AUTHORIZE_SECRET, GATE_AUTHORIZE_SECRET_SUCCESS, GATE_AUTHORIZE_SECRET_ERROR],
    method: 'auth.generateSecret',
    params: {},
  },
});

// TODO: Should be uncommented when captcha for login will be implemented
const gateAuthorize = ({ username, secret, /* captcha, */ sign }) => ({
  [CALL_GATE]: {
    types: [GATE_AUTHORIZE, GATE_AUTHORIZE_SUCCESS, GATE_AUTHORIZE_ERROR],
    method: 'auth.authorize',
    params: {
      user: username,
      secret,
      sign,
      // captcha,
    },
  },
});

/**
 * Функция авторизации на Gate.
 * @param {string} userId
 * @param {string} username
 * @param {string} privateKey - приватный ключ или пароль
 * @param {Object} [params] - параметры
 * @returns {Promise<*>}
 */
export const gateLogin = ({ userId, username, captcha, privateKey }, params) => async dispatch => {
  dispatch({
    type: AUTH_LOGIN,
    meta: params,
  });

  try {
    const { actualKey } = commun.getActualAuth(userId, privateKey);

    const { secret } = await dispatch(getAuthSecret());

    const signature = sign(secret, actualKey);

    const auth = await dispatch(
      gateAuthorize({
        username,
        secret,
        captcha,
        sign: signature,
      })
    );

    commun.initProvider(actualKey);

    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: {
        userId: auth.userId,
        username: auth.username,
        permission: auth.permission,
      },
    });

    if (params.needSaveAuth) {
      saveAuth({
        userId: auth.userId,
        username: auth.username,
        privateKey: actualKey,
      });
    }

    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    document.cookie = `commun.userId=${auth.userId}; path=/; expires=${date.toGMTString()}`;

    try {
      await dispatch(fetchProfile({ userId: auth.userId }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Fetch user information error');
    }

    setTimeout(async () => {
      try {
        await dispatch(fetchSettings());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Fetch user private information failed:', err);
      }
    }, 0);

    return auth;
  } catch (err) {
    dispatch({
      type: AUTH_LOGIN_ERROR,
      error: err.message,
      meta: params,
    });

    // while we have incorrect responses from backend (should be replaced with correct messages)
    throw new Error('Invalid login or password');
  }
};

export const userInputGateLogin = (userInput, key, captcha, params) => async dispatch => {
  const username = userInput.trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/.test(username)) {
    throw new Error('Invalid username');
  }

  const { userId } = await dispatch(resolveProfile(username));

  if (!userId) {
    throw new Error('User is not found');
  }

  return dispatch(gateLogin({ userId, username, captcha, privateKey: key }, params));
};

export const logout = () => async (dispatch, getState) => {
  removeAuth();

  const state = getState();
  const isAuth = isAuthorizedSelector(state);

  document.cookie = `commun.userId=; path=/; expires=${new Date().toGMTString()}`;

  dispatch({ type: AUTH_LOGOUT, payload: {} });

  if (isAuth) {
    try {
      // dispatch(unsubscribeNotifications());
      dispatch({
        [CALL_GATE]: {
          method: 'auth.logout',
          params: {},
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  dispatch({ type: AUTH_LOGOUT_SUCCESS, payload: {} });
};
