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
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USERS_BLACKLIST:
      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_USERS_BLACKLIST_SUCCESS:
      return {
        ...state,
        order: payload.result.items,
        isLoading: false,
      };

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
