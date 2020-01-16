import { uniq } from 'ramda';

import {
  FETCH_USERS_BLACKLIST,
  FETCH_USERS_BLACKLIST_SUCCESS,
  FETCH_USERS_BLACKLIST_ERROR,
  BLOCK_USER,
  UNBLOCK_USER,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USERS_BLACKLIST:
      if (meta.offset) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        isLoading: true,
        isEnd: false,
      };

    case FETCH_USERS_BLACKLIST_SUCCESS: {
      let order;

      if (meta.offset) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        order,
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
      };
    }

    case FETCH_USERS_BLACKLIST_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case BLOCK_USER:
      return {
        ...state,
        order: uniq(state.order.concat(meta.blocking)),
      };

    case UNBLOCK_USER:
      return {
        ...state,
        order: state.order.filter(user => user !== meta.blocking),
      };

    default:
      return state;
  }
}
