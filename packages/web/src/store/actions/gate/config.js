/* eslint-disable import/prefer-default-export */

import {
  FETCH_GLOBAL_CONFIG,
  FETCH_GLOBAL_CONFIG_ERROR,
  FETCH_GLOBAL_CONFIG_SUCCESS,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const getGlobalConfig = () => ({
  [CALL_GATE]: {
    types: [FETCH_GLOBAL_CONFIG, FETCH_GLOBAL_CONFIG_SUCCESS, FETCH_GLOBAL_CONFIG_ERROR],
    method: 'config.getConfig',
    params: {},
  },
});
