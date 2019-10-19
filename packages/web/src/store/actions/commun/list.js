/* eslint-disable import/prefer-default-export */

import { currentUserIdSelector } from 'store/selectors/auth';

import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  JOIN_COMMUNITY,
  JOIN_COMMUNITY_SUCCESS,
  JOIN_COMMUNITY_ERROR,
  LEAVE_COMMUNITY,
  LEAVE_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_ERROR,
} from 'store/constants';

export const joinCommunity = communityId => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    commun_code: communityId,
    follower: userId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [JOIN_COMMUNITY, JOIN_COMMUNITY_SUCCESS, JOIN_COMMUNITY_ERROR],
      contract: 'list',
      method: 'follow',
      params: data,
    },
    meta: {
      userId,
      communityId,
    },
  });
};

export const leaveCommunity = communityId => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    commun_code: communityId,
    follower: userId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [LEAVE_COMMUNITY, LEAVE_COMMUNITY_SUCCESS, LEAVE_COMMUNITY_ERROR],
      contract: 'list',
      method: 'unfollow',
      params: data,
    },
    meta: {
      userId,
      communityId,
    },
  });
};
