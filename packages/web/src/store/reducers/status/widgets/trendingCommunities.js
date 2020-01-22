import {
  FETCH_TRENDING_COMMUNITIES,
  FETCH_TRENDING_COMMUNITIES_SUCCESS,
  FETCH_TRENDING_COMMUNITIES_ERROR,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  JOIN_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
  forceSubscribed: [],
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_TRENDING_COMMUNITIES:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_TRENDING_COMMUNITIES_SUCCESS:
      return {
        ...state,
        order: payload.result.items,
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
      };

    case FETCH_TRENDING_COMMUNITIES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case JOIN_COMMUNITY_SUCCESS:
      return {
        ...state,
        forceSubscribed: state.forceSubscribed.concat(meta.communityId),
      };

    case LEAVE_COMMUNITY_SUCCESS:
      return {
        ...state,
        forceSubscribed: state.forceSubscribed.filter(
          communityId => communityId !== meta.communityId
        ),
      };

    case AUTH_LOGIN_SUCCESS:
    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
