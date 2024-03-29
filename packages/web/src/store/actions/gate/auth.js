/* eslint-disable no-shadow,prefer-destructuring */

import commun from 'commun-client';
import { sign } from 'commun-client/lib/auth';

import {
  LOGIN_ERROR_INVALID_CREDENTIALS,
  LOGIN_ERROR_INVALID_USERNAME,
  LOGIN_ERROR_NOT_FOUND,
} from 'shared/constants';
import { Router } from 'shared/routes';
import { trackUserId } from 'utils/analytics';
import { removeAuth, saveAuth } from 'utils/localStore';
import { displayError } from 'utils/toastsMessages';
import { fetchCommunitiesBlacklist, fetchUsersBlacklist } from 'store/actions/gate/blacklist';
import { resolveProfile } from 'store/actions/gate/content';
import { getNotificationsStatus, notificationsSubscribe } from 'store/actions/gate/notifications';
import { fetchSettings } from 'store/actions/gate/settings';
import { fetchProfile } from 'store/actions/gate/user';
import { getBalance } from 'store/actions/gate/wallet';
import {
  AUTH_LOGIN,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
  GATE_AUTHORIZE,
  GATE_AUTHORIZE_ERROR,
  GATE_AUTHORIZE_SECRET,
  GATE_AUTHORIZE_SECRET_ERROR,
  GATE_AUTHORIZE_SECRET_SUCCESS,
  GATE_AUTHORIZE_SUCCESS,
  SET_SERVER_ACCOUNT_NAME,
  SET_SERVER_REFERRAL_ID,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { isWebViewSelector } from 'store/selectors/common';

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

  let gateSuccessAuthorized = false;

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

    gateSuccessAuthorized = true;

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
          dispatch(fetchUsersBlacklist({ userId: auth.userId })),
          dispatch(fetchCommunitiesBlacklist({ userId: auth.userId })),
          dispatch(notificationsSubscribe())
            .catch(err => {
              // eslint-disable-next-line no-console
              console.warn('Notifications subscribe failed:', err);
            })
            .then(() => dispatch(getNotificationsStatus())),
        ]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Fetch user private information failed:', err);
      }
    }, 0);

    trackUserId(auth.userId);

    return auth;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Gate auth failed:', err);

    dispatch({
      type: AUTH_LOGIN_ERROR,
      error: err.message,
      meta: params,
    });

    if (!gateSuccessAuthorized) {
      if (err.message.includes('Public key verification failed - access denied')) {
        throw new Error(LOGIN_ERROR_INVALID_CREDENTIALS);
      }
    }

    throw new Error('Authorization error');
  }
};

export const userInputGateLogin = (userInput, password, captcha) => async dispatch => {
  const username = userInput.trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/.test(username)) {
    throw new Error(LOGIN_ERROR_INVALID_USERNAME);
  }

  const { userId } = await dispatch(resolveProfile(username));

  if (!userId) {
    throw new Error(LOGIN_ERROR_NOT_FOUND);
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

export const logout = ({ preventRedirect = false, skipAuthClear = false } = {}) => async (
  dispatch,
  getState
) => {
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

  dispatch({ type: AUTH_LOGOUT_SUCCESS, payload: { skipAuthClear } });

  trackUserId(null);

  if (!preventRedirect) {
    // reload page on next tick
    setTimeout(() => {
      Router.pushRoute('home');
    }, 0);
  }
};
