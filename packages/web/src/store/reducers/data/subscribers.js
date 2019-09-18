import {
  FETCH_SUBSCRIBERS,
  FETCH_SUBSCRIBERS_SUCCESS,
  FETCH_SUBSCRIBERS_ERROR,
} from 'store/constants';
import { uniq } from 'ramda';

const initialState = {
  order: [],
  isEnd: false,
  isLoading: false,
  sequenceKey: null,
  error: null,
};

export default function(state = initialState, { type, payload, error, meta }) {
  switch (type) {
    case FETCH_SUBSCRIBERS:
      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
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
      let order;
      const { items, sequenceKey } = payload.result;

      // Если передан sequenceKey и он соответствует текущей
      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
        order = uniq(state.order.concat(items));
      } else {
        order = items;
      }

      return {
        ...state,
        order,
        sequenceKey,
        isLoading: false,
        isEnd: items.length < meta.limit,
        error: null,
      };
    }

    case FETCH_SUBSCRIBERS_ERROR:
      return {
        ...initialState,
        isLoading: false,
        error,
      };

    default:
      return state;
  }
}
