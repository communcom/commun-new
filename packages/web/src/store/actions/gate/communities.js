/* eslint-disable import/prefer-default-export */

import {
  COMMUNITIES_FETCH_LIMIT,
  MY_COMMUNITIES_FETCH_LIMIT,
  USER_COMMUNITIES_FETCH_LIMIT,
} from 'shared/constants';
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
  FETCH_USER_COMMUNITIES,
  FETCH_USER_COMMUNITIES_ERROR,
  FETCH_USER_COMMUNITIES_SUCCESS,
  FETCH_TRENDING_COMMUNITIES,
  FETCH_TRENDING_COMMUNITIES_SUCCESS,
  FETCH_TRENDING_COMMUNITIES_ERROR,
  FETCH_COMMUNITY_MEMBERS,
  FETCH_COMMUNITY_MEMBERS_SUCCESS,
  FETCH_COMMUNITY_MEMBERS_ERROR,
  FETCH_COMMUNITY_MEMBERS_WIDGET,
  FETCH_COMMUNITY_MEMBERS_WIDGET_SUCCESS,
  FETCH_COMMUNITY_MEMBERS_WIDGET_ERROR,
  FETCH_LEADER_COMMUNITIES,
  FETCH_LEADER_COMMUNITIES_SUCCESS,
  FETCH_LEADER_COMMUNITIES_ERROR,
  FETCH_MANAGEMENT_COMMUNITIES,
  FETCH_MANAGEMENT_COMMUNITIES_SUCCESS,
  FETCH_MANAGEMENT_COMMUNITIES_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

export const fetchMyCommunities = ({
  limit = MY_COMMUNITIES_FETCH_LIMIT,
  offset = 0,
} = {}) => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());

  const newParams = {
    type: 'community',
    userId,
    limit,
    offset,
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

export const fetchUserCommunities = ({
  userId,
  limit = USER_COMMUNITIES_FETCH_LIMIT,
  offset = 0,
}) => {
  const newParams = {
    type: 'community',
    userId,
    limit,
    offset,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_USER_COMMUNITIES, FETCH_USER_COMMUNITIES_SUCCESS, FETCH_USER_COMMUNITIES_ERROR],
      method: 'content.getSubscriptions',
      params: newParams,
      schema: {
        items: [communitySchema],
      },
    },
    meta: newParams,
  };
};

export const fetchCommunity = ({ communityId, communityAlias }) => ({
  [CALL_GATE]: {
    types: [FETCH_COMMUNITY, FETCH_COMMUNITY_SUCCESS, FETCH_COMMUNITY_ERROR],
    method: 'content.getCommunity',
    params: { communityId, communityAlias },
    schema: communitySchema,
  },
  meta: { communityId, communityAlias, waitAutoLogin: true },
});

export const getCommunities = (
  { userId, search = '', offset, limit = COMMUNITIES_FETCH_LIMIT } = {},
  types
) => {
  const params = {
    userId: userId || undefined,
    search,
    offset,
    limit,
  };

  return {
    [CALL_GATE]: {
      types: types || [FETCH_COMMUNITIES, FETCH_COMMUNITIES_SUCCESS, FETCH_COMMUNITIES_ERROR],
      method: 'content.getCommunities',
      params,
      schema: {
        items: [communitySchema],
      },
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};

export const getTrendingCommunities = ({ limit = 20 } = {}) =>
  getCommunities({ limit }, [
    FETCH_TRENDING_COMMUNITIES,
    FETCH_TRENDING_COMMUNITIES_SUCCESS,
    FETCH_TRENDING_COMMUNITIES_ERROR,
  ]);

export const fetchCommunityMembers = ({ communityId, offset, limit = 20 }, types) => ({
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

export const fetchCommunityMembersWidget = params =>
  fetchCommunityMembers(params, [
    FETCH_COMMUNITY_MEMBERS_WIDGET,
    FETCH_COMMUNITY_MEMBERS_WIDGET_SUCCESS,
    FETCH_COMMUNITY_MEMBERS_WIDGET_ERROR,
  ]);

export const fetchLeaderCommunities = ({ offset = 0, limit = 20 } = {}) => ({
  [CALL_GATE]: {
    types: [
      FETCH_LEADER_COMMUNITIES,
      FETCH_LEADER_COMMUNITIES_SUCCESS,
      FETCH_LEADER_COMMUNITIES_ERROR,
    ],
    method: 'content.getLeaderCommunities',
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

export const fetchManagementCommunities = ({ offset = 0, limit = 5 } = {}) => ({
  [CALL_GATE]: {
    types: [
      FETCH_MANAGEMENT_COMMUNITIES,
      FETCH_MANAGEMENT_COMMUNITIES_SUCCESS,
      FETCH_MANAGEMENT_COMMUNITIES_ERROR,
    ],
    method: 'content.getLeaderCommunities',
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
