import pick from 'ramda/src/pick';

import {
  DELETE_POST_SUCCESS,
  FETCH_POSTS,
  FETCH_POSTS_ERROR,
  FETCH_POSTS_SUCCESS,
} from 'store/constants/actionTypes';
import pagination from 'store/utils/pagination';

const initialState = {
  filter: undefined,
};

function reducer(state = initialState, { type, meta }) {
  switch (type) {
    case FETCH_POSTS_SUCCESS: {
      const newFilter = pick(['type', 'timeframe'], meta);

      return {
        ...state,
        filter: {
          ...state.filter,
          ...newFilter,
        },
      };
    }

    case DELETE_POST_SUCCESS: {
      return {
        ...state,
        order: state.order.filter(postId => postId !== meta.postId),
      };
    }

    default:
      return state;
  }
}

export default pagination([FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR])(reducer);
