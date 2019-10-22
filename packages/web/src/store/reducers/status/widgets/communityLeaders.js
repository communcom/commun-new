import {
  FETCH_LEADERS_WIDGET,
  FETCH_LEADERS_WIDGET_SUCCESS,
  FETCH_LEADERS_WIDGET_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  communityId: null,
  items: [],
  isLoading: false,
  isLoaded: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_LEADERS_WIDGET:
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

    case FETCH_LEADERS_WIDGET_SUCCESS: {
      if (state.communityId !== meta.communityId) {
        return state;
      }

      return {
        ...state,
        items: payload.items,
        isLoading: false,
        isLoaded: true,
      };
    }

    case FETCH_LEADERS_WIDGET_ERROR: {
      if (state.communityId !== meta.communityId) {
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