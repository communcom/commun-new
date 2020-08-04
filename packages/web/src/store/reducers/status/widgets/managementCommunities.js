import uniq from 'ramda/src/uniq';

import {
  AUTH_LOGOUT_SUCCESS,
  BECOME_LEADER_SUCCESS,
  FETCH_MANAGEMENT_COMMUNITIES,
  FETCH_MANAGEMENT_COMMUNITIES_ERROR,
  FETCH_MANAGEMENT_COMMUNITIES_SUCCESS,
  STOP_LEADER_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isLoaded: false,
};

export default function reducerStatusWidgetsManagementCommunities(
  state = initialState,
  { type, payload, meta }
) {
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
