import {
  UNAUTH_ADD_COMMUNITY,
  UNAUTH_CLEAR_COMMUNITIES,
  UNAUTH_REMOVE_COMMUNITY,
  UNAUTH_SET_AIRDROP_COMMUNITY,
  UNAUTH_ADD_COMMUNITIES,
} from 'store/constants';

export const unauthAddCommunity = communityId => ({
  type: UNAUTH_ADD_COMMUNITY,
  payload: { communityId },
});

export const unauthAddCommunities = communityIds => ({
  type: UNAUTH_ADD_COMMUNITIES,
  payload: { communityIds },
});

export const unauthRemoveCommunity = communityId => ({
  type: UNAUTH_REMOVE_COMMUNITY,
  payload: { communityId },
});

export const unauthClearCommunities = () => ({
  type: UNAUTH_CLEAR_COMMUNITIES,
  payload: {},
});

export const unauthSetAirdropCommunity = communityId => ({
  type: UNAUTH_SET_AIRDROP_COMMUNITY,
  payload: { communityId },
});
