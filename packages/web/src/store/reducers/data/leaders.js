import { FETCH_LEADERS, FETCH_LEADERS_SUCCESS, FETCH_LEADERS_ERROR } from 'store/constants';
import { uniqBy } from 'ramda';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  isEnd: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_LEADERS:
      if (meta.offset) {
        return {
          ...initialState,
          isLoading: true,
        };
      }

      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case FETCH_LEADERS_SUCCESS: {
      const items = meta.offset
        ? uniqBy(item => item.username, state.items.concat(payload.items))
        : payload.items;

      return {
        ...state,
        items,
        isEnd: payload.items.length < meta.limit,
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
