import { uniq } from 'ramda';

import {
  FETCH_USER_COMMUNITIES,
  FETCH_USER_COMMUNITIES_ERROR,
  FETCH_USER_COMMUNITIES_SUCCESS,
} from 'store/constants';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USER_COMMUNITIES:
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

    case FETCH_USER_COMMUNITIES_SUCCESS: {
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

    case FETCH_USER_COMMUNITIES_ERROR: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
