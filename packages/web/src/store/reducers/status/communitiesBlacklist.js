import { uniq } from 'ramda';

import {
  FETCH_COMMUNITIES_BLACKLIST,
  FETCH_COMMUNITIES_BLACKLIST_SUCCESS,
  FETCH_COMMUNITIES_BLACKLIST_ERROR,
  BLOCK_COMMUNITY,
  UNBLOCK_COMMUNITY,
} from 'store/constants/actionTypes';

import pagination from 'store/utils/pagination';

function reducer(state, { type, meta }) {
  switch (type) {
    case FETCH_COMMUNITIES_BLACKLIST_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case BLOCK_COMMUNITY:
      return {
        ...state,
        order: uniq(state.order.concat(meta.communityId)),
      };

    case UNBLOCK_COMMUNITY:
      return {
        ...state,
        order: state.order.filter(community => community !== meta.communityId),
      };

    default:
      return state;
  }
}

export default pagination([
  FETCH_COMMUNITIES_BLACKLIST,
  FETCH_COMMUNITIES_BLACKLIST_SUCCESS,
  FETCH_COMMUNITIES_BLACKLIST_ERROR,
])(reducer);
