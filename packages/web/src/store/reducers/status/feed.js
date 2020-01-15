import { uniq, pick } from 'ramda';

import {
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
  DELETE_POST_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
  error: null,
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

    case DELETE_POST_SUCCESS: {
      return {
        ...state,
        order: state.order.filter(postId => postId !== meta.postId),
      };
    }

    default:
      return state;
  }
}
