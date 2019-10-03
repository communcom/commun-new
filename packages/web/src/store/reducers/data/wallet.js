import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
} from 'store/constants';

const initialState = {
  balances: [],
  transfers: {
    sequenceKey: null,
    received: [],
    sent: [],
    all: [],
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
      // eslint-disable-next-line no-case-declarations
      const items = meta.sequenceKey
        ? state.transfers[meta.filter].concat(payload.items)
        : payload.items;

      return {
        ...state,
        transfers: {
          ...state.transfers,
          [meta.filter]: items,
          sequenceKey: payload.sequenceKey,
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
