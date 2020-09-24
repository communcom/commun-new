import uniq from 'ramda/src/uniq';

import {
  FETCH_COMMUNITY_BLACKLIST,
  FETCH_COMMUNITY_BLACKLIST_ERROR,
  FETCH_COMMUNITY_BLACKLIST_SUCCESS,
} from 'store/constants';

const initialState = {
  communityId: null,
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function reducerStatusCommunityBlacklist(
  state = initialState,
  { type, payload, meta }
) {
  switch (type) {
    case FETCH_COMMUNITY_BLACKLIST:
      if (meta.offset && state.communityId === meta.communityId) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        communityId: meta.communityId,
        isLoading: true,
        isEnd: false,
      };

    case FETCH_COMMUNITY_BLACKLIST_SUCCESS: {
      if (state.communityId !== meta.communityId) {
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
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
      };
    }

    case FETCH_COMMUNITY_BLACKLIST_ERROR:
      if (state.communityId !== meta.communityId) {
        return state;
      }

      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
