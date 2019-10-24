import { uniq } from 'ramda';

import {
  FETCH_COMMUNITY_MEMBERS,
  FETCH_COMMUNITY_MEMBERS_SUCCESS,
  FETCH_COMMUNITY_MEMBERS_ERROR,
  JOIN_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  communityId: null,
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_COMMUNITY_MEMBERS:
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

    case FETCH_COMMUNITY_MEMBERS_SUCCESS: {
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

    case FETCH_COMMUNITY_MEMBERS_ERROR:
      if (state.communityId !== meta.communityId) {
        return state;
      }

      return {
        ...state,
        isLoading: false,
      };

    case JOIN_COMMUNITY_SUCCESS:
      if (meta.communityId === state.communityId) {
        return {
          ...state,
          order: uniq(state.order.concat(meta.userId)),
        };
      }
      return state;

    case LEAVE_COMMUNITY_SUCCESS:
      if (meta.communityId === state.communityId) {
        return {
          ...state,
          order: state.order.filter(userId => userId !== meta.userId),
        };
      }
      return state;

    default:
      return state;
  }
}
