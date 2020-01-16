import { uniq } from 'ramda';

import {
  FETCH_COMMUNITIES_BLACKLIST,
  FETCH_COMMUNITIES_BLACKLIST_SUCCESS,
  FETCH_COMMUNITIES_BLACKLIST_ERROR,
  BLOCK_COMMUNITY,
  UNBLOCK_COMMUNITY,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_COMMUNITIES_BLACKLIST:
      if (meta.offset) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        isLoading: true,
        isEnd: false,
      };

    case FETCH_COMMUNITIES_BLACKLIST_SUCCESS: {
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
        isEnd: payload.result.items.length < meta.limit,
      };
    }

    case FETCH_COMMUNITIES_BLACKLIST_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case BLOCK_COMMUNITY:
      return {
        ...state,
        order: uniq(state.order.concat(meta.communityId)),
      };

    case UNBLOCK_COMMUNITY:
      return {
        ...state,
        order: state.order.filter(community => community !== meta.communityId),
      };

    default:
      return state;
  }
}
