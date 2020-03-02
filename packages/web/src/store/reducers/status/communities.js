import {
  FETCH_COMMUNITIES,
  FETCH_COMMUNITIES_SUCCESS,
  FETCH_COMMUNITIES_ERROR,
} from 'store/constants/actionTypes';

import pagination from 'store/utils/pagination';

export default pagination([FETCH_COMMUNITIES, FETCH_COMMUNITIES_SUCCESS, FETCH_COMMUNITIES_ERROR]);
