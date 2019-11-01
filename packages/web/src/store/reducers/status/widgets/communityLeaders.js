import { uniq } from 'ramda';
import {
  FETCH_LEADERS_WIDGET,
  FETCH_LEADERS_WIDGET_SUCCESS,
  FETCH_LEADERS_WIDGET_ERROR,
  BECOME_LEADER_SUCCESS,
  STOP_LEADER_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  communityId: null,
  order: [],
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
        order: payload.result.items,
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

    case BECOME_LEADER_SUCCESS:
      return {
        ...state,
        order: uniq(state.order.concat(`${meta.communityId}/${meta.userId}`)),
      };

    case STOP_LEADER_SUCCESS:
      return {
        ...state,
        order: state.order.filter(user => user !== `${meta.communityId}/${meta.userId}`),
      };

    default:
      return state;
  }
}
