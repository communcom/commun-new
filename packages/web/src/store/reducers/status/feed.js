import { uniq, pick } from 'ramda';

import { FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR } from 'store/constants/actionTypes';
import { TIMEFRAME_DAY } from 'shared/constants';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
  error: null,
  filter: {
    timeframe: TIMEFRAME_DAY,
  },
};

export default function(state = initialState, { type, payload, error, meta }) {
  switch (type) {
    case FETCH_POSTS:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_POSTS_SUCCESS: {
      let order;
      const { items } = payload.result;

      if (meta.offset) {
        order = uniq(state.order.concat(items));
      } else {
        order = items;
      }

      const newFilter = pick(['type', 'timeframe'], meta);

      return {
        ...state,
        order,
        isLoading: false,
        isEnd: items.length < meta.limit,
        error: null,
        filter: {
          ...state.filter,
          ...newFilter,
        },
      };
    }

    case FETCH_POSTS_ERROR:
      return {
        ...state,
        isLoading: false,
        error,
      };

    default:
      return state;
  }
}
