import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_POINT_HISTORY_SUCCESS,
  FETCH_POINT_HISTORY_ERROR,
} from 'store/constants';

const initialState = {
  balances: [],
  history: [],
  pointHistory: {},
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
      const items = meta.offset ? state.history.concat(payload.items) : payload.items;

      return {
        ...state,
        history: items,
      };

    case FETCH_POINT_HISTORY_SUCCESS:
      return {
        ...state,
        pointHistory: {
          ...state.pointHistory,
          [meta.symbol]: payload.items,
        },
      };

    case FETCH_TRANSFERS_HISTORY_ERROR:
    case FETCH_POINT_HISTORY_ERROR:
      return {
        ...state,
      };

    default:
      return state;
  }
}
