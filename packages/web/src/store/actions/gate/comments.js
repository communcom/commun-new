/* eslint-disable no-console */
import splitEvery from 'ramda/src/splitEvery';

import {
  COMMENTS_FETCH_LIMIT,
  COMMENTS_NESTED_FETCH_LIMIT,
  FEED_PAGE_SIZE,
} from 'shared/constants';
import { fetchDonations } from 'store/actions/gate/donations';
import {
  FETCH_POST_COMMENT,
  FETCH_POST_COMMENT_ERROR,
  FETCH_POST_COMMENT_SUCCESS,
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_ERROR,
  FETCH_POST_COMMENTS_NESTED,
  FETCH_POST_COMMENTS_NESTED_ERROR,
  FETCH_POST_COMMENTS_NESTED_SUCCESS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_PROFILE_COMMENTS,
  FETCH_PROFILE_COMMENTS_ERROR,
  FETCH_PROFILE_COMMENTS_SUCCESS,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  commentSchema,
  extractContentId,
  profileCommentSchema,
  updateCommentSchema,
} from 'store/schemas/gate';

const fetchCommentsDonations = items => async dispatch => {
  const newItems = items.map(item => item.contentId);

  for (const item of items) {
    if (item.children && item.children.length) {
      for (const children of item.children) {
        newItems.push(extractContentId(children));
      }
    }
  }

  const chunks = splitEvery(20, newItems);

  for (const chunk of chunks) {
    // eslint-disable-next-line no-await-in-loop
    await dispatch(fetchDonations(chunk));
  }
};

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
      await fetchCommentsDonations(res.items);
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
      await fetchCommentsDonations(res.items);
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
      await fetchCommentsDonations(res.items);
    }
  } catch (err) {
    console.error(err);
  }

  return res;
};
