import { uniq } from 'ramda';

import {
  FETCH_REPORTS_LIST,
  FETCH_REPORTS_LIST_SUCCESS,
  FETCH_REPORTS_LIST_ERROR,
} from 'store/constants';

const initialState = {
  order: [],
  communitiesKey: null,
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_REPORTS_LIST:
    case FETCH_REPORTS_LIST_SUCCESS:
    case FETCH_REPORTS_LIST_ERROR: {
      const communitiesKey = [...(meta.communityIds || [])].sort().join(';');
      const isSameKey = communitiesKey === state.communitiesKey;

      switch (type) {
        case FETCH_REPORTS_LIST:
          if (isSameKey && meta.offset) {
            return {
              ...state,
              isLoading: true,
            };
          }

          return {
            ...initialState,
            communitiesKey,
            isLoading: true,
            isEnd: false,
          };

        case FETCH_REPORTS_LIST_SUCCESS: {
          if (!isSameKey) {
            return state;
          }

          let order;

          if (meta.offset) {
            order = uniq(state.order.concat(payload.result.items));
          } else {
            order = payload.result.items;
          }

          return {
            ...state,
            order,
            communitiesKey,
            isLoading: false,
            isEnd: payload.result.items.length < meta.limit,
          };
        }

        case FETCH_REPORTS_LIST_ERROR: {
          if (!isSameKey) {
            return state;
          }

          return {
            ...state,
            isLoading: false,
          };
        }

        default:
          return state;
      }
    }

    default:
      return state;
  }
}
