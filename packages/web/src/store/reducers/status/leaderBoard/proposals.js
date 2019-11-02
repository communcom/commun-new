import { uniq } from 'ramda';

import {
  FETCH_PROPOSALS,
  FETCH_PROPOSALS_SUCCESS,
  FETCH_PROPOSALS_ERROR,
  CLEAR_LEADER_BOARD_STATUS,
} from 'store/constants';

const initialState = {
  order: [],
  communitiesKey: null,
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_PROPOSALS:
    case FETCH_PROPOSALS_SUCCESS:
    case FETCH_PROPOSALS_ERROR: {
      const communitiesKey = [...meta.communitiesIds].sort().join(';');
      const isSameKey = communitiesKey === state.communitiesKey;

      switch (type) {
        case FETCH_PROPOSALS:
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

        case FETCH_PROPOSALS_SUCCESS: {
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

        case FETCH_PROPOSALS_ERROR: {
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
    case CLEAR_LEADER_BOARD_STATUS:
      return {
        ...initialState,
        isEnd: true,
      };

    default:
      return state;
  }
}
