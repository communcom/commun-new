/* eslint-disable import/prefer-default-export */

import { communitySchema, userSchema } from 'store/schemas/gate';
import {
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_SUCCESS,
  FETCH_MY_COMMUNITIES_ERROR,
  FETCH_COMMUNITY,
  FETCH_COMMUNITY_SUCCESS,
  FETCH_COMMUNITY_ERROR,
  FETCH_COMMUNITIES,
  FETCH_COMMUNITIES_SUCCESS,
  FETCH_COMMUNITIES_ERROR,
  FETCH_TRENDING_COMMUNITIES,
  FETCH_TRENDING_COMMUNITIES_SUCCESS,
  FETCH_TRENDING_COMMUNITIES_ERROR,
  FETCH_COMMUNITY_MEMBERS,
  FETCH_COMMUNITY_MEMBERS_SUCCESS,
  FETCH_COMMUNITY_MEMBERS_ERROR,
  FETCH_COMMUNITY_MEMBERS_WIDGET,
  FETCH_COMMUNITY_MEMBERS_WIDGET_SUCCESS,
  FETCH_COMMUNITY_MEMBERS_WIDGET_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

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

export const getCommunities = ({ offset = 0, limit = 20 } = {}, types) => ({
  [CALL_GATE]: {
    types: types || [FETCH_COMMUNITIES, FETCH_COMMUNITIES_SUCCESS, FETCH_COMMUNITIES_ERROR],
    method: 'content.getCommunities',
    params: { offset, limit },
    schema: {
      items: [communitySchema],
    },
  },
  meta: {
    offset,
    limit,
    waitAutoLogin: true,
  },
});

export const getTrendingCommunities = ({ limit = 20 } = {}) =>
  getCommunities({ limit }, [
    FETCH_TRENDING_COMMUNITIES,
    FETCH_TRENDING_COMMUNITIES_SUCCESS,
    FETCH_TRENDING_COMMUNITIES_ERROR,
  ]);

export const getCommunityMembers = ({ communityId, offset = 0, limit = 20 }, types) => ({
  [CALL_GATE]: {
    types: types || [
      FETCH_COMMUNITY_MEMBERS,
      FETCH_COMMUNITY_MEMBERS_SUCCESS,
      FETCH_COMMUNITY_MEMBERS_ERROR,
    ],
    method: 'content.getSubscribers',
    params: { communityId, offset, limit },
    schema: {
      items: [userSchema],
    },
  },
  meta: {
    communityId,
    offset,
    limit,
    waitAutoLogin: true,
  },
});

export const getCommunityMembersWidget = params =>
  getCommunityMembers(params, [
    FETCH_COMMUNITY_MEMBERS_WIDGET,
    FETCH_COMMUNITY_MEMBERS_WIDGET_SUCCESS,
    FETCH_COMMUNITY_MEMBERS_WIDGET_ERROR,
  ]);
