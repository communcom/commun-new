import {
  FETCH_COMMUNITY_MEMBERS_WIDGET,
  FETCH_COMMUNITY_MEMBERS_WIDGET_SUCCESS,
  FETCH_COMMUNITY_MEMBERS_WIDGET_ERROR,
  JOIN_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  communityId: null,
  order: [],
  isLoading: false,
  isLoaded: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_COMMUNITY_MEMBERS_WIDGET:
      if (state.communityId === meta.communityId) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        communityId: meta.communityId,
        isLoading: true,
        isLoaded: false,
      };

    case FETCH_COMMUNITY_MEMBERS_WIDGET_SUCCESS: {
      if (state.communityId !== meta.communityId) {
        return state;
      }

      return {
        ...state,
        order: payload.result.items,
        isLoading: false,
        isLoaded: true,
      };
    }

    case FETCH_COMMUNITY_MEMBERS_WIDGET_ERROR: {
      if (state.communityId !== meta.communityId) {
        return state;
      }

      return {
        ...state,
        isLoading: false,
      };
    }

    case JOIN_COMMUNITY_SUCCESS:
      if (meta.communityId === state.communityId) {
        return {
          ...state,
          order: state.order.concat(meta.userId),
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
