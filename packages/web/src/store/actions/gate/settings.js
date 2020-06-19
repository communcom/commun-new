import { mergeDeepRight } from 'ramda';

import {
  FETCH_SETTINGS,
  FETCH_SETTINGS_ERROR,
  FETCH_SETTINGS_SUCCESS,
  SET_SETTINGS,
  SET_SETTINGS_ERROR,
  SET_SETTINGS_SUCCESS,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { dataSelector } from 'store/selectors/common';

export const fetchSettings = options => ({
  [CALL_GATE]: {
    types: [FETCH_SETTINGS, FETCH_SETTINGS_SUCCESS, FETCH_SETTINGS_ERROR],
    method: 'settings.getUserSettings',
    params: options,
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const updateSettings = options => (dispatch, getState) => {
  const settings = dataSelector(['settings', 'user'])(getState());
  const newSettings = mergeDeepRight(settings, options);

  return dispatch({
    [CALL_GATE]: {
      types: [SET_SETTINGS, SET_SETTINGS_SUCCESS, SET_SETTINGS_ERROR],
      method: 'settings.setUserSettings',
      params: {
        params: newSettings,
      },
    },
    meta: {
      options,
      waitAutoLogin: true,
    },
  });
};

export const getNotificationsSettings = () => ({
  [CALL_GATE]: {
    method: 'settings.getNotificationsSettings',
    params: {},
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const setNotificationsSettings = ({ disable }) => ({
  [CALL_GATE]: {
    method: 'settings.setNotificationsSettings',
    params: {
      disable,
    },
  },
  meta: {
    waitAutoLogin: true,
  },
});
