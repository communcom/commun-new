import {
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  FETCH_TRENDING_COMMUNITIES,
  FETCH_TRENDING_COMMUNITIES_ERROR,
  FETCH_TRENDING_COMMUNITIES_SUCCESS,
  JOIN_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_SUCCESS,
} from 'store/constants/actionTypes';
import pagination, { initialPaginationState } from 'store/utils/pagination';

const initialState = {
  ...initialPaginationState,
  forceSubscribed: [],
};

function reducer(state = initialState, { type, meta }) {
  switch (type) {
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

export default pagination([
  FETCH_TRENDING_COMMUNITIES,
  FETCH_TRENDING_COMMUNITIES_SUCCESS,
  FETCH_TRENDING_COMMUNITIES_ERROR,
])(reducer);
