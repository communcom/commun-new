import filter from 'ramda/src/filter';
import map from 'ramda/src/map';
import pipe from 'ramda/src/pipe';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';

import {
  FETCH_EXCHANGE_CURRENCIES_FULL_SUCCESS,
  FETCH_POINT_HISTORY_ERROR,
  FETCH_POINT_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_USER_BALANCE_SUCCESS,
} from 'store/constants';

const initialState = {
  balances: [],
  exchangeCurrencies: [],
  transferHistory: [],
  pointHistory: {},
};

export default function reducerDataWallet(state = initialState, { type, payload, meta }) {
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
          exchangeCurrencies: pipe(
            map(item => ({
              ...item,
              symbol: item.name.toUpperCase(), // because of changehero have lowercase names
            })),
            filter(item => !['RUB', 'CMN', 'USD', 'EUR'].includes(item.symbol)), // because we don't use fiat
            sortBy(prop('fullName'))
          )(payload),
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
