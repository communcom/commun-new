import {
  FETCH_USER_COMMUNITIES,
  FETCH_USER_COMMUNITIES_SUCCESS,
  FETCH_USER_COMMUNITIES_ERROR,
} from 'store/constants';
import { uniq } from 'ramda';

const initialState = {
  order: [],
  isEnd: false,
  isLoading: false,
  error: null,
};

export default function(state = initialState, { type, payload, error, meta }) {
  switch (type) {
    case FETCH_USER_COMMUNITIES:
      if (meta.offset) {
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      }

      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_USER_COMMUNITIES_SUCCESS: {
      const { items } = payload.result;
      let order;

      // Если передан sequenceKey и он соответствует текущей
      if (meta.offset) {
        order = uniq(state.order.concat(items));
      } else {
        order = items;
      }

      return {
        ...state,
        order,
        isLoading: false,
        isEnd: items.length < meta.limit,
        error: null,
      };
    }

    case FETCH_USER_COMMUNITIES_ERROR:
      return {
        ...state,
        isLoading: false,
        error,
      };

    default:
      return state;
  }
}
