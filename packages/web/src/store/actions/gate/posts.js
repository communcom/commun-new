import { postSchema, formatContentId } from 'store/schemas/gate';
import {
  FEED_TYPE_TOP_COMMENTS,
  FEED_TYPE_TOP_LIKES,
  FEED_TYPE_TOP_REWARDS,
  POSTS_FETCH_LIMIT,
} from 'shared/constants';
import {
  FETCH_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_ERROR,
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
} from 'store/constants/actionTypes';
import { entitySelector } from 'store/selectors/common';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchPost = params => ({
  [CALL_GATE]: {
    types: [FETCH_POST, FETCH_POST_SUCCESS, FETCH_POST_ERROR],
    method: 'content.getPost',
    params,
    schema: postSchema,
  },
  meta: {
    ...params,
    waitAutoLogin: true,
  },
});

export const fetchPostIfNeeded = contentId => (dispatch, getState) => {
  if (!entitySelector('posts', formatContentId(contentId))(getState())) {
    return dispatch(fetchPost(contentId));
  }
  return null;
};

export const fetchPosts = ({
  type,
  timeframe,
  username,
  userId,
  communityId,
  communityAlias,
  offset = 0,
}) => async dispatch => {
  const params = {
    type,
    username,
    userId,
    communityId,
    communityAlias,
    limit: POSTS_FETCH_LIMIT,
    offset,
  };

  if ([FEED_TYPE_TOP_LIKES, FEED_TYPE_TOP_COMMENTS, FEED_TYPE_TOP_REWARDS].includes(type)) {
    params.timeframe = timeframe;
  }

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR],
      method: 'content.getPosts',
      params,
      schema: {
        items: [postSchema],
      },
    },
    meta: params,
  });
};
