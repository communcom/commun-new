import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_POINT_HISTORY_SUCCESS,
  FETCH_POINT_HISTORY_ERROR,
  FETCH_EXCHANGE_CURRENCIES_FULL_SUCCESS,
} from 'store/constants';

const initialState = {
  balances: [],
  exchangeCurrencies: [],
  transferHistory: [],
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
      return {
        ...state,
        transferHistory: meta.offset ? state.transferHistory.concat(payload.items) : payload.items,
      };

    case FETCH_POINT_HISTORY_SUCCESS:
      return {
        ...state,
        pointHistory: {
          ...state.pointHistory,
          [meta.symbol]: payload.items,
        },
      };

    case FETCH_EXCHANGE_CURRENCIES_FULL_SUCCESS:
      if (payload.length) {
        return {
          ...state,
          exchangeCurrencies: payload
            .map(item => ({ ...item, name: item.name.toUpperCase() })) // because of changehero have lowercase names
            .filter(item => !['RUB', 'USD', 'EUR'].includes(item.name)), // because we don't use fiat
        };
      }

      return state;

    case FETCH_TRANSFERS_HISTORY_ERROR:
    case FETCH_POINT_HISTORY_ERROR:
      return {
        ...state,
      };

    default:
      return state;
  }
}
