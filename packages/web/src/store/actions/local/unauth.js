import {
  UNAUTH_ADD_COMMUNITY,
  UNAUTH_CLEAR_COMMUNITIES,
  UNAUTH_REMOVE_COMMUNITY,
} from 'store/constants';

export const unauthAddCommunity = communityId => dispatch => {
  dispatch({
    type: UNAUTH_ADD_COMMUNITY,
    payload: { communityId },
  });
};

export const unauthRemoveCommunity = communityId => dispatch => {
  dispatch({
    type: UNAUTH_REMOVE_COMMUNITY,
    payload: { communityId },
  });
};

export const unauthClearCommunities = () => ({
  type: UNAUTH_CLEAR_COMMUNITIES,
  payload: {},
});
