import {
  FETCH_SETTINGS,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_ERROR,
  SET_SETTINGS,
  SET_SETTINGS_SUCCESS,
  SET_SETTINGS_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

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

export const updateSettings = options => ({
  [CALL_GATE]: {
    types: [SET_SETTINGS, SET_SETTINGS_SUCCESS, SET_SETTINGS_ERROR],
    method: 'settings.setUserSettings',
    params: {
      params: options,
    },
  },
  meta: {
    options,
    waitAutoLogin: true,
  },
});

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
