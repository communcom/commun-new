import {
  FETCH_MANAGEMENT_COMMUNITIES,
  FETCH_MANAGEMENT_COMMUNITIES_SUCCESS,
  FETCH_MANAGEMENT_COMMUNITIES_ERROR,
  BECOME_LEADER_SUCCESS,
  STOP_LEADER_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
} from 'store/constants/actionTypes';
import { uniq } from 'ramda';

const initialState = {
  order: [],
  isLoading: false,
  isLoaded: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_MANAGEMENT_COMMUNITIES:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_MANAGEMENT_COMMUNITIES_SUCCESS: {
      return {
        ...state,
        order: payload.result.items,
        isLoading: false,
        isLoaded: true,
      };
    }
    case FETCH_MANAGEMENT_COMMUNITIES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case BECOME_LEADER_SUCCESS:
      return {
        ...state,
        order: uniq(state.order.concat(meta.communityId)),
      };

    case STOP_LEADER_SUCCESS:
      return {
        ...state,
        order: state.order.filter(id => id !== meta.communityId),
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
