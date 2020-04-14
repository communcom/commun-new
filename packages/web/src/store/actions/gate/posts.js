import { postSchema, formatContentId } from 'store/schemas/gate';
import {
  FEED_TYPE_TOP_LIKES,
  FEED_TYPE_SUBSCRIPTIONS_POPULAR,
  FEED_TYPE_COMMUNITY,
  FEED_TYPE_USER,
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
import { isNsfwAllowedSelector } from 'store/selectors/settings';
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
      // eslint-disable-next-line no-console
      console.error('fetchReward failed:', err);
    });

    return dispatch(getPostAction);
  }

  if (!process.browser && params.userId) {
    const [post] = await Promise.all([
      dispatch(getPostAction),
      dispatch(fetchReward(params)).catch(err => {
        // eslint-disable-next-line no-console
        console.error('fetchReward failed:', err);
      }),
    ]);

    return post;
  }

  const post = await dispatch(getPostAction);
  await dispatch(fetchReward(post.contentId)).catch(err => {
    // eslint-disable-next-line no-console
    console.error('fetchReward failed:', err);
  });

  return post;
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
  offset = 0,
}) => async (dispatch, getState) => {
  const params = {
    type,
    username,
    userId,
    communityId,
    communityAlias,
    limit: POSTS_FETCH_LIMIT,
    offset,
  };

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
      await dispatch(fetchRewards(res.items.map(({ contentId }) => contentId)));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res;
};
