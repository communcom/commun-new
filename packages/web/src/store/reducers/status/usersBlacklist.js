import uniq from 'ramda/src/uniq';

import {
  BLOCK_USER,
  FETCH_USERS_BLACKLIST,
  FETCH_USERS_BLACKLIST_ERROR,
  FETCH_USERS_BLACKLIST_SUCCESS,
  UNBLOCK_USER,
} from 'store/constants/actionTypes';
import pagination from 'store/utils/pagination';

function reducer(state, { type, meta }) {
  switch (type) {
    case BLOCK_USER:
      return {
        ...state,
        order: uniq(state.order.concat(meta.blocking)),
      };

    case UNBLOCK_USER:
      return {
        ...state,
        order: state.order.filter(user => user !== meta.blocking),
      };

    default:
      return state;
  }
}

export default pagination([
  FETCH_USERS_BLACKLIST,
  FETCH_USERS_BLACKLIST_SUCCESS,
  FETCH_USERS_BLACKLIST_ERROR,
])(reducer);
