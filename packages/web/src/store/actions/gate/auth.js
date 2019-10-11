/* eslint-disable no-shadow,prefer-destructuring */

import commun from 'commun-client';
import { sign } from 'commun-client/lib/auth';

import { saveAuth, removeAuth } from 'utils/localStore';
import { fetchProfile } from 'store/actions/gate/user';
import { getBalance } from 'store/actions/gate/wallet';
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

const USER_ID_RX = /^[a-z1-5][a-z1-5.]{0,11}[a-z1-5]$/;

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

const gateAuthorize = (secret, user, sign) => ({
  [CALL_GATE]: {
    types: [GATE_AUTHORIZE, GATE_AUTHORIZE_SUCCESS, GATE_AUTHORIZE_ERROR],
    method: 'auth.authorize',
    params: { secret, user, sign },
  },
});

/**
 * Функция авторизации на Gate.
 * @param {string} user - в этом поле может быть userId или username.
 * @param {string} key - приватный ключ или пароль
 * @param {Object} [meta] - параметры
 * @returns {Promise<*>}
 */
export const gateLogin = (user, key, meta = {}) => async dispatch => {
  dispatch({
    type: AUTH_LOGIN,
    meta,
  });

  const { needSaveAuth = false } = meta;

  try {
    const { actualKey } = commun.getActualAuth(user, key);

    const { secret } = await dispatch(getAuthSecret());

    const signature = sign(secret, actualKey);

    const auth = await dispatch(gateAuthorize(secret, user, signature));
    commun.initProvider(actualKey);

    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: {
        userId: auth.user,
        username: auth.displayName,
        permission: auth.permission,
      },
    });

    if (needSaveAuth) {
      saveAuth(user, actualKey);
    }

    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    document.cookie = `commun.userId=${auth.user}; path=/; expires=${date.toGMTString()}`;

    try {
      await dispatch(fetchProfile({ userId: auth.user }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('fetch user information error');
    }

    setTimeout(async () => {
      try {
        // TODO: add another needAuth actions
        await Promise.all([dispatch(fetchSettings()), dispatch(getBalance(auth.user))]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('fetch user private information error');
      }
    }, 0);

    return auth;
  } catch (err) {
    dispatch({
      type: AUTH_LOGIN_ERROR,
      error: err.message,
      meta,
    });

    // while we have incorrect responses from backend (should be replaced with correct messages)
    throw new Error('Invalid login or password.');
  }
};

export const userInputGateLogin = (userInput, key, meta = {}) => async dispatch => {
  let user = userInput.trim().toLowerCase();

  const communityMatch = user.match(/^(.+)@(.+)$/);
  let forceUseUsername = false;

  if (communityMatch) {
    if (communityMatch[2] === 'commun') {
      forceUseUsername = true;
      user = communityMatch[1];
    } else {
      throw new Error('Invalid domain');
    }
  }

  if (!USER_ID_RX.test(user)) {
    forceUseUsername = true;
  }

  try {
    const { userId } = await dispatch(resolveProfile(user));

    if (userId) {
      return await dispatch(gateLogin(userId, key, meta));
    }
  } catch (err) {
    if (forceUseUsername) {
      throw err;
    }
  }

  return dispatch(gateLogin(user, key, meta));
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
