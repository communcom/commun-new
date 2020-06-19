/* eslint-disable no-param-reassign */
import {
  FETCH_REWARD,
  FETCH_REWARD_ERROR,
  FETCH_REWARD_SUCCESS,
  FETCH_REWARDS,
  FETCH_REWARDS_ERROR,
  FETCH_REWARDS_SUCCESS,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { formatContentId, formatRewardId, rewardSchema } from 'store/schemas/gate';

export const fetchReward = contentId => dispatch => {
  const params = {
    userId: contentId.userId,
    permlink: contentId.permlink,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_REWARD, FETCH_REWARD_SUCCESS, FETCH_REWARD_ERROR],
      method: 'rewards.getState',
      params,
      schema: rewardSchema,
      postProcess: result => {
        result.contentId = contentId;
      },
    },
    meta: {
      contentId,
    },
  });
};

export const fetchRewards = posts => dispatch => {
  const params = {
    posts: posts.map(({ userId, permlink }) => ({ userId, permlink })),
  };
  const contentIds = {};

  for (const post of posts) {
    contentIds[formatRewardId(post)] = {
      formattedContentId: formatContentId(post),
      contentId: post,
    };
  }

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_REWARDS, FETCH_REWARDS_SUCCESS, FETCH_REWARDS_ERROR],
      method: 'rewards.getStateBulk',
      params,
      schema: {
        mosaics: [rewardSchema],
      },
      postProcess: results => {
        for (const item of results.mosaics) {
          const rewardContentId = formatRewardId(item.contentId);
          const postData = contentIds[rewardContentId];

          if (postData) {
            item.contentId = {
              ...postData.contentId,
            };
          }
        }
      },
    },
    meta: {
      params,
    },
  });
};
