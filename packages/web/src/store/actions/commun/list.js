/* eslint-disable import/prefer-default-export */

import { currentUserIdSelector } from 'store/selectors/auth';

import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  FOLLOW_COMMUNITY,
  FOLLOW_COMMUNITY_SUCCESS,
  FOLLOW_COMMUNITY_ERROR,
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
      types: [FOLLOW_COMMUNITY, FOLLOW_COMMUNITY_SUCCESS, FOLLOW_COMMUNITY_ERROR],
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
