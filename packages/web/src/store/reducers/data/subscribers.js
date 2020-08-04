import uniq from 'ramda/src/uniq';

import {
  FETCH_SUBSCRIBERS,
  FETCH_SUBSCRIBERS_ERROR,
  FETCH_SUBSCRIBERS_SUCCESS,
} from 'store/constants';

const initialState = {
  order: [],
  isEnd: false,
  isLoading: false,
  error: null,
};

export default function reducerDataSubscribers(
  state = initialState,
  { type, payload, error, meta }
) {
  switch (type) {
    case FETCH_SUBSCRIBERS:
      if (meta.offset) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_SUBSCRIBERS_SUCCESS: {
      const { items } = payload.result;
      let order;

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

    case FETCH_SUBSCRIBERS_ERROR:
      return {
        ...state,
        isLoading: false,
        error,
      };

    default:
      return state;
  }
}
