import {
  FETCH_USER_COMMUNITIES,
  FETCH_USER_COMMUNITIES_ERROR,
  FETCH_USER_COMMUNITIES_SUCCESS,
} from 'store/constants';

import pagination from 'store/utils/pagination';

export default pagination([
  FETCH_USER_COMMUNITIES,
  FETCH_USER_COMMUNITIES_SUCCESS,
  FETCH_USER_COMMUNITIES_ERROR,
]);
