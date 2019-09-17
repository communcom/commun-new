import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
} from 'store/constants';

import { TRANSFERS_TYPE } from 'shared/constants';

const initialState = {
  balances: [],
  transfers: {
    received: [],
    sent: [],
  },
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USER_BALANCE_SUCCESS:
      return {
        ...state,
        balances: payload.balances || [],
      };
    case FETCH_USER_BALANCE_ERROR:
      return {
        ...state,
      };
    case FETCH_TRANSFERS_HISTORY_SUCCESS:
      return {
        ...state,
        transfers: {
          ...state.transfers,
          [meta.query.receiver ? TRANSFERS_TYPE.RECEIVED : TRANSFERS_TYPE.SENT]:
            payload.transfers || [],
        },
      };
    case FETCH_TRANSFERS_HISTORY_ERROR:
      return {
        ...state,
      };
    default:
      return state;
  }
}
