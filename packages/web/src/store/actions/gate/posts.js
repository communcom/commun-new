import { postSchema, formatContentId } from 'store/schemas/gate';
import { POSTS_FETCH_LIMIT } from 'shared/constants';
import {
  FETCH_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_ERROR,
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
} from 'store/constants/actionTypes';
import { entitySelector, statusSelector } from 'store/selectors/common';
import { currentUnsafeServerUserIdSelector } from 'store/selectors/auth';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchPost = contentId => ({
  [CALL_GATE]: {
    types: [FETCH_POST, FETCH_POST_SUCCESS, FETCH_POST_ERROR],
    method: 'content.getPost',
    params: contentId,
    schema: postSchema,
  },
  meta: contentId,
});

export const fetchPostIfNeeded = contentId => (dispatch, getState) => {
  if (!entitySelector('posts', formatContentId(contentId))(getState())) {
    return dispatch(fetchPost(contentId));
  }
  return null;
};

export const fetchPosts = ({ type, sortBy, timeframe, id, sequenceKey }) => (
  dispatch,
  getState
) => {
  const username = currentUnsafeServerUserIdSelector(getState());
  const { filter } = statusSelector('feed')(getState());

  const newParams = {
    limit: POSTS_FETCH_LIMIT,
    sequenceKey: sequenceKey || null,
  };

  if (username) {
    newParams.userId = username;
  }

  if (!sortBy) {
    newParams.sortBy = filter.sortBy;
  } else {
    newParams.sortBy = sortBy;
  }

  if (type === 'community') {
    newParams.type = 'community';
    newParams.communityId = id;

    if (newParams.sortBy === 'popular') {
      if (timeframe) {
        newParams.timeframe = timeframe;
      } else {
        newParams.timeframe = filter.timeframe;
      }
    }
  } else if (type === 'user') {
    newParams.type = 'byUser';
    newParams.userId = id;
  } else {
    throw new Error('Invalid fetch posts type');
  }

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR],
      method: 'content.getPosts',
      params: {}, // newParams,
      schema: {
        items: [postSchema],
      },
    },
    meta: newParams,
  });
};
