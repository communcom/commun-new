import {
  AUTH_LOGOUT,
  FETCH_USER_REFERRALS,
  FETCH_USER_REFERRALS_ERROR,
  FETCH_USER_REFERRALS_SUCCESS,
} from 'store/constants/actionTypes';
import pagination, { initialPaginationState } from 'store/utils/pagination';

function reducer(state, { type }) {
  switch (type) {
    case AUTH_LOGOUT:
      return initialPaginationState;
    default:
      return state;
  }
}

export default pagination([
  FETCH_USER_REFERRALS,
  FETCH_USER_REFERRALS_SUCCESS,
  FETCH_USER_REFERRALS_ERROR,
])(reducer);
