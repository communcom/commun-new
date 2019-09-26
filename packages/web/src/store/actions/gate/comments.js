import { commentSchema, profileCommentSchema } from 'store/schemas/gate';
import { FEED_PAGE_SIZE } from 'shared/constants';
import {
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
  FETCH_FEED_COMMENTS,
  FETCH_FEED_COMMENTS_SUCCESS,
  FETCH_FEED_COMMENTS_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchPostComments = ({
  contentId,
  sequenceKey,
  sortBy = 'timeDesc',
  limit = FEED_PAGE_SIZE,
}) => async dispatch => {
  const newParams = {
    type: 'post',
    sortBy,
    limit,
    sequenceKey: sequenceKey || null,
    ...contentId,
    app: 'gls',
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POST_COMMENTS, FETCH_POST_COMMENTS_SUCCESS, FETCH_POST_COMMENTS_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [commentSchema],
      },
    },
    meta: newParams,
  });
};

export const fetchUserComments = ({ userId, sequenceKey, sortBy = 'timeDesc' }) => dispatch => {
  const newParams = {
    type: 'user',
    sortBy,
    limit: FEED_PAGE_SIZE,
    sequenceKey: sequenceKey || null,
    userId,
    app: 'gls',
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_FEED_COMMENTS, FETCH_FEED_COMMENTS_SUCCESS, FETCH_FEED_COMMENTS_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [profileCommentSchema],
      },
    },
    meta: newParams,
  });
};
