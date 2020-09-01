import {
  FEED_TYPE_COMMUNITY,
  FEED_TYPE_SUBSCRIPTIONS_POPULAR,
  FEED_TYPE_TOP_LIKES,
  FEED_TYPE_USER,
  POSTS_FETCH_LIMIT,
} from 'shared/constants';
import { captureException } from 'utils/errors';
import {
  FETCH_POST,
  FETCH_POST_ERROR,
  FETCH_POST_SUCCESS,
  FETCH_POSTS,
  FETCH_POSTS_ERROR,
  FETCH_POSTS_SUCCESS,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { formatContentId, postSchema } from 'store/schemas/gate';
import { entitySelector } from 'store/selectors/common';
import { currentLocalesPostsSelector, isNsfwAllowedSelector } from 'store/selectors/settings';

import { fetchDonations, fetchPostDonations } from './donations';
import { fetchReward, fetchRewards } from './rewards';

export const fetchPost = (params, withoutReward) => async dispatch => {
  const getPostAction = {
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
  };

  if (withoutReward) {
    return dispatch(getPostAction);
  }

  if (process.browser && params.userId) {
    // for fetchPost by direct link currently used username
    dispatch(fetchReward(params)).catch(err => {
      captureException(err, 'fetchReward failed:');
    });

    dispatch(fetchPostDonations(params)).catch(err => {
      captureException(err, 'fetchPostDonations failed:');
    });

    return dispatch(getPostAction);
  }

  return dispatch(getPostAction);
};

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
  allowedLanguages,
  limit,
  offset = 0,
}) => async (dispatch, getState) => {
  const params = {
    type,
    username,
    userId,
    communityId,
    communityAlias,
    limit: limit || POSTS_FETCH_LIMIT,
    offset,
  };

  if (allowedLanguages && allowedLanguages.length) {
    params.allowedLanguages = allowedLanguages;
  } else if (type !== FEED_TYPE_USER) {
    const localesPosts = currentLocalesPostsSelector(getState());

    if (localesPosts && localesPosts.length) {
      params.allowedLanguages = localesPosts;
    }
  }

  if ([FEED_TYPE_TOP_LIKES, FEED_TYPE_SUBSCRIPTIONS_POPULAR].includes(type)) {
    params.timeframe = timeframe;
  }

  if ([FEED_TYPE_COMMUNITY, FEED_TYPE_USER].includes(type)) {
    const isNsfwAllowed = isNsfwAllowedSelector(getState());

    params.allowNsfw = isNsfwAllowed;
  }

  const res = await dispatch({
    [CALL_GATE]: {
      types: [FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR],
      method: 'content.getPosts',
      params,
      schema: {
        items: [postSchema],
      },
    },
    meta: {
      ...params,
      abortPrevious: true,
    },
  });

  try {
    if (res?.items?.length) {
      const items = res.items.map(({ contentId }) => contentId);

      if (process.browser) {
        dispatch(fetchRewards(items));
        dispatch(fetchDonations(items));

        return res;
      }
    }
  } catch (err) {
    captureException(err);
  }

  return res;
};
