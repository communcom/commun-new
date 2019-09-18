import {
  FETCH_SETTINGS,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_ERROR,
  SET_SETTINGS,
  SET_SETTINGS_SUCCESS,
  SET_SETTINGS_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchSettings = () => ({
  [CALL_GATE]: {
    types: [FETCH_SETTINGS, FETCH_SETTINGS_SUCCESS, FETCH_SETTINGS_ERROR],
    method: 'options.get',
    params: {
      profile: 'commun_web',
      app: 'gls',
    },
  },
  meta: {
    needAuth: true,
  },
});

export const saveSettings = options => ({
  [CALL_GATE]: {
    types: [SET_SETTINGS, SET_SETTINGS_SUCCESS, SET_SETTINGS_ERROR],
    method: 'options.set',
    params: {
      ...options,
      profile: 'commun_web',
      app: 'gls',
    },
  },
  meta: {
    ...options,
    needAuth: true,
  },
});
