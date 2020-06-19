import {
  FETCH_PROFILE_COMMENTS,
  FETCH_PROFILE_COMMENTS_ERROR,
  FETCH_PROFILE_COMMENTS_SUCCESS,
} from 'store/constants/actionTypes';
import pagination from 'store/utils/pagination';

export default pagination([
  FETCH_PROFILE_COMMENTS,
  FETCH_PROFILE_COMMENTS_SUCCESS,
  FETCH_PROFILE_COMMENTS_ERROR,
]);
