/* eslint-disable no-console */
import { commentSchema, profileCommentSchema, updateCommentSchema } from 'store/schemas/gate';
import {
  FEED_PAGE_SIZE,
  COMMENTS_FETCH_LIMIT,
  COMMENTS_NESTED_FETCH_LIMIT,
} from 'shared/constants';
import {
  FETCH_POST_COMMENT,
  FETCH_POST_COMMENT_SUCCESS,
  FETCH_POST_COMMENT_ERROR,
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
  FETCH_POST_COMMENTS_NESTED,
  FETCH_POST_COMMENTS_NESTED_SUCCESS,
  FETCH_POST_COMMENTS_NESTED_ERROR,
  FETCH_PROFILE_COMMENTS,
  FETCH_PROFILE_COMMENTS_SUCCESS,
  FETCH_PROFILE_COMMENTS_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { fetchDonations } from 'store/actions/gate/donations';

export const fetchComment = ({ contentId, parentCommentId, parentPostId }) => async dispatch =>
  dispatch({
    [CALL_GATE]: {
      types: [FETCH_POST_COMMENT, FETCH_POST_COMMENT_SUCCESS, FETCH_POST_COMMENT_ERROR],
      method: 'content.getComment',
      params: contentId,
      schema: updateCommentSchema,
    },
    meta: {
      contentId,
      parentCommentId,
      parentPostId,
    },
  });

export const fetchPostComments = ({
  contentId,
  sortBy = 'timeDesc',
  limit = COMMENTS_FETCH_LIMIT,
  offset = 0,
  resolveNestedComments = false,
}) => async dispatch => {
  const newParams = {
    type: 'post',
    sortBy,
    limit,
    offset,
    resolveNestedComments,
  };

  const res = await dispatch({
    [CALL_GATE]: {
      types: [FETCH_POST_COMMENTS, FETCH_POST_COMMENTS_SUCCESS, FETCH_POST_COMMENTS_ERROR],
      method: 'content.getComments',
      params: {
        ...newParams,
        ...contentId,
      },
      schema: {
        items: [commentSchema],
      },
    },
    meta: {
      ...newParams,
      contentId,
    },
  });

  try {
    if (res?.items?.length) {
      const items = res.items.map(item => item.contentId);
      await dispatch(fetchDonations(items));
    }
  } catch (err) {
    console.error(err);
  }

  return res;
};

export const fetchNestedComments = ({
  contentId,
  parentComment,
  sortBy = 'time',
  limit = COMMENTS_NESTED_FETCH_LIMIT,
  offset = 0,
}) => async dispatch => {
  const newParams = {
    type: 'post',
    parentComment,
    sortBy,
    limit,
    offset,
  };

  const res = await dispatch({
    [CALL_GATE]: {
      types: [
        FETCH_POST_COMMENTS_NESTED,
        FETCH_POST_COMMENTS_NESTED_SUCCESS,
        FETCH_POST_COMMENTS_NESTED_ERROR,
      ],
      method: 'content.getComments',
      params: {
        ...newParams,
        ...contentId,
      },
      schema: {
        items: [commentSchema],
      },
    },
    meta: {
      ...newParams,
      contentId,
    },
  });

  try {
    if (res?.items?.length) {
      const items = res.items.map(item => item.contentId);
      await dispatch(fetchDonations(items));
    }
  } catch (err) {
    console.error(err);
  }

  return res;
};

export const fetchUserComments = ({
  userId,
  sortBy = 'timeDesc',
  offset = 0,
}) => async dispatch => {
  const newParams = {
    userId,
    type: 'user',
    sortBy,
    limit: FEED_PAGE_SIZE,
    offset,
  };

  const res = await dispatch({
    [CALL_GATE]: {
      types: [FETCH_PROFILE_COMMENTS, FETCH_PROFILE_COMMENTS_SUCCESS, FETCH_PROFILE_COMMENTS_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [profileCommentSchema],
      },
    },
    meta: newParams,
  });

  try {
    if (res?.items?.length) {
      const items = res.items.map(item => item.contentId);
      await dispatch(fetchDonations(items));
    }
  } catch (err) {
    console.error(err);
  }

  return res;
};
