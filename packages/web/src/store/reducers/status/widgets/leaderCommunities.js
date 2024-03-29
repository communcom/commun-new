import {
  FETCH_LEADER_COMMUNITIES,
  FETCH_LEADER_COMMUNITIES_ERROR,
  FETCH_LEADER_COMMUNITIES_SUCCESS,
} from 'store/constants/actionTypes';
import pagination from 'store/utils/pagination';

export default pagination([
  FETCH_LEADER_COMMUNITIES,
  FETCH_LEADER_COMMUNITIES_SUCCESS,
  FETCH_LEADER_COMMUNITIES_ERROR,
]);
