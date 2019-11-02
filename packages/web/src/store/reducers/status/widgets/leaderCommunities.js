import { uniq } from 'ramda';

import {
  FETCH_LEADER_COMMUNITIES,
  FETCH_LEADER_COMMUNITIES_SUCCESS,
  FETCH_LEADER_COMMUNITIES_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_LEADER_COMMUNITIES:
      if (meta.offset) {
        return {
          ...state,
          isLoading: false,
        };
      }

      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_LEADER_COMMUNITIES_SUCCESS: {
      let order;

      if (meta.offset) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        order,
        isLoading: false,
        isEnd: payload.result.items < meta.limit,
      };
    }
    case FETCH_LEADER_COMMUNITIES_ERROR:
      return {
        ...state,
        isEnd: false,
      };

    default:
      return state;
  }
}