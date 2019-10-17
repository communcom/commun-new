/* eslint-disable import/prefer-default-export */

import { communitySchema } from 'store/schemas/gate';
import {
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_SUCCESS,
  FETCH_MY_COMMUNITIES_ERROR,
  FETCH_COMMUNITY,
  FETCH_COMMUNITY_SUCCESS,
  FETCH_COMMUNITY_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

export const fetchMyCommunities = () => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());

  const newParams = {
    type: 'community',
    userId,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_MY_COMMUNITIES, FETCH_MY_COMMUNITIES_SUCCESS, FETCH_MY_COMMUNITIES_ERROR],
      method: 'content.getSubscriptions',
      params: newParams,
      schema: {
        items: [communitySchema],
      },
    },
    meta: newParams,
  });
};

export const fetchCommunity = ({ communityId, communityAlias }) => ({
  [CALL_GATE]: {
    types: [FETCH_COMMUNITY, FETCH_COMMUNITY_SUCCESS, FETCH_COMMUNITY_ERROR],
    method: 'content.getCommunity',
    params: { communityId, communityAlias },
    schema: communitySchema,
  },
  meta: { communityId, communityAlias },
});

export const fetchMyCommunitiesIfNeed = () => (dispatch, getState) => {
  const state = getState();

  const { isLoading, items } = dataSelector(['myCommunities'])(state);

  if (!isLoading && !items) {
    return dispatch(fetchMyCommunities());
  }

  return undefined;
};
