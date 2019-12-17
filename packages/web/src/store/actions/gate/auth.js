/* eslint-disable no-shadow,prefer-destructuring */

import commun from 'commun-client';
import { sign } from 'commun-client/lib/auth';

import { saveAuth, removeAuth } from 'utils/localStore';
import { Router } from 'shared/routes';
import { fetchProfile } from 'store/actions/gate/user';
import { getBalance } from 'store/actions/gate';
import { fetchSettings } from 'store/actions/gate/settings';
import { fetchUsersBlacklist, fetchCommunitiesBlacklist } from 'store/actions/gate/blacklist';
import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
  SET_SERVER_ACCOUNT_NAME,
  SET_SERVER_REFERRAL_ID,
  GATE_AUTHORIZE_SECRET,
  GATE_AUTHORIZE_SECRET_SUCCESS,
  GATE_AUTHORIZE_SECRET_ERROR,
  GATE_AUTHORIZE,
  GATE_AUTHORIZE_SUCCESS,
  GATE_AUTHORIZE_ERROR,
} from 'store/constants';
import { isWebViewSelector } from 'store/selectors/common';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { resolveProfile } from 'store/actions/gate/content';
import { displayError } from 'utils/toastsMessages';

export const setServerAccountName = userId => ({
  type: SET_SERVER_ACCOUNT_NAME,
  payload: {
    userId,
  },
});

export const setServerRefId = refId => ({
  type: SET_SERVER_REFERRAL_ID,
  payload: {
    refId,
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
 * @param {string} username
 * @param {string} activePrivateKey - активный приватный ключ
 * @param {string} [password] - пароль
 * @param {string} [captcha]
 * @param {Object} [params] - параметры
 * @returns {Promise<*>}
 */
export const gateLogin = ({ username, activePrivateKey, password, captcha }, params) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: AUTH_LOGIN,
    meta: params,
  });

  try {
    const { secret } = await dispatch(getAuthSecret());

    const signature = sign(secret, activePrivateKey);

    const auth = await dispatch(
      gateAuthorize({
        username,
        secret,
        captcha,
        sign: signature,
      })
    );

    commun.initProvider(activePrivateKey);

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
        activePrivateKey,
      });

      if (isWebViewSelector(getState()) && password && typeof Android === 'object') {
        try {
          // eslint-disable-next-line no-undef
          Android.storeUserInfo(auth.username, auth.userId, password);
        } catch (err) {
          displayError(err);
        }
      }
    }

    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    document.cookie = `commun_user_id=${auth.userId}; path=/; expires=${date.toGMTString()}`;

    try {
      await Promise.all([
        dispatch(fetchProfile({ userId: auth.userId })),
        // FIXME
        dispatch(getBalance()),
      ]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Fetch user information error');
    }

    setTimeout(async () => {
      try {
        await Promise.all([
          dispatch(fetchSettings()),
          dispatch(fetchUsersBlacklist(auth.userId)),
          dispatch(fetchCommunitiesBlacklist(auth.userId)),
        ]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Fetch user private information failed:', err);
      }
    }, 0);

    return auth;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    dispatch({
      type: AUTH_LOGIN_ERROR,
      error: err.message,
      meta: params,
    });

    // while we have incorrect responses from backend (should be replaced with correct messages)
    throw new Error('Invalid login or password');
  }
};

export const userInputGateLogin = (userInput, password, captcha) => async dispatch => {
  const username = userInput.trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/.test(username)) {
    throw new Error('Invalid username');
  }

  const { userId } = await dispatch(resolveProfile(username));

  if (!userId) {
    throw new Error('User is not found');
  }

  const { privateKey } = commun.extractKeyPair(userId, password, 'active');

  return dispatch(
    gateLogin(
      {
        username,
        password,
        activePrivateKey: privateKey,
        captcha,
      },
      {
        needSaveAuth: true,
      }
    )
  );
};

export const logout = ({ preventRedirect = false } = {}) => async (dispatch, getState) => {
  removeAuth();

  if (isWebViewSelector(getState()) && typeof Android === 'object') {
    try {
      // eslint-disable-next-line no-undef
      Android.clearUserInfo();
    } catch (err) {
      displayError(err);
    }
  }

  const state = getState();
  const isAuth = isAuthorizedSelector(state);

  document.cookie = `commun_user_id=; path=/; expires=${new Date().toGMTString()}`;

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

  if (!preventRedirect) {
    // reload page on next tick
    setTimeout(() => {
      Router.pushRoute('home');
    }, 0);
  }
};
