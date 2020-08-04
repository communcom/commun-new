import uniq from 'ramda/src/uniq';

import {
  AUTH_LOGOUT_SUCCESS,
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_ERROR,
  FETCH_MY_COMMUNITIES_SUCCESS,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
} from 'store/constants/actionTypes';
import pagination, { initialPaginationState } from 'store/utils/pagination';

function reducer(state, { type, meta }) {
  switch (type) {
    // optimistic
    case JOIN_COMMUNITY:
      return {
        ...state,
        order: uniq([meta.communityId].concat(state.order)),
      };

    // optimistic
    case LEAVE_COMMUNITY:
      return {
        ...state,
        order: state.order.filter(communityId => communityId !== meta.communityId),
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialPaginationState;

    default:
  }

  return state;
}

export default pagination([
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_SUCCESS,
  FETCH_MY_COMMUNITIES_ERROR,
])(reducer);
