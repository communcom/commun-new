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
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_COMMUNITIES_BLACKLIST:
      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_COMMUNITIES_BLACKLIST_SUCCESS: {
      return {
        ...state,
        order: payload.result.items,
        isLoading: false,
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
