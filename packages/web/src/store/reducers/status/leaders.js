import { uniq } from 'ramda';

import { FETCH_LEADERS, FETCH_LEADERS_SUCCESS, FETCH_LEADERS_ERROR } from 'store/constants';

const initialState = {
  order: [],
  isLoading: false,
  isError: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_LEADERS:
      if (meta.offset) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        isLoading: true,
        isError: false,
      };

    case FETCH_LEADERS_SUCCESS: {
      const order = meta.offset
        ? uniq(state.order.concat(payload.result.items))
        : payload.result.items;

      return {
        ...state,
        order,
        isEnd: payload.result.items.length < meta.limit,
        isLoading: false,
        isError: false,
      };
    }

    case FETCH_LEADERS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    default:
      return state;
  }
}
