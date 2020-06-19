import { uniq } from 'ramda';

import { FETCH_LEADERS, FETCH_LEADERS_ERROR, FETCH_LEADERS_SUCCESS } from 'store/constants';

const initialState = {
  order: [],
  fetchPrefix: null,
  prefix: null,
  isLoading: false,
  isError: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_LEADERS: {
      const isPagination = meta.offset && (state.prefix || null) === (meta.prefix || null);

      if (isPagination) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        fetchPrefix: meta.prefix || null,
        isLoading: true,
        isError: false,
      };
    }

    case FETCH_LEADERS_SUCCESS: {
      if (state.fetchPrefix !== (meta.prefix || null)) {
        return state;
      }

      const isPagination = meta.offset && (state.prefix || null) === (meta.prefix || null);

      const order = isPagination
        ? uniq(state.order.concat(payload.result.items))
        : payload.result.items;

      return {
        ...state,
        order,
        prefix: meta.prefix || null,
        fetchPrefix: null,
        isEnd: payload.result.items.length < meta.limit,
        isLoading: false,
        isError: false,
      };
    }

    case FETCH_LEADERS_ERROR:
      return {
        ...state,
        fetchPrefix: null,
        isLoading: false,
        isError: true,
      };

    default:
      return state;
  }
}
