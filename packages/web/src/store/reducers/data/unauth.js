import uniq from 'ramda/src/uniq';

import {
  AUTH_LOGOUT_SUCCESS,
  UNAUTH_ADD_COMMUNITIES,
  UNAUTH_ADD_COMMUNITY,
  UNAUTH_CLEAR_COMMUNITIES,
  UNAUTH_REMOVE_COMMUNITY,
  UNAUTH_RESTORE_STATE,
  UNAUTH_SET_AIRDROP_COMMUNITY,
} from 'store/constants';

const initialState = {
  communities: [],
  airdropCommunityId: null,
};

export default function reducerDataUnauth(state = initialState, { type, payload }) {
  switch (type) {
    case UNAUTH_ADD_COMMUNITY:
      return {
        ...state,
        communities: uniq(state.communities.concat(payload.communityId)),
      };

    case UNAUTH_ADD_COMMUNITIES:
      return {
        ...state,
        communities: uniq([...state.communities, ...payload.communityIds]),
      };

    case UNAUTH_RESTORE_STATE:
      return {
        ...state,
        ...payload.state,
      };

    case UNAUTH_REMOVE_COMMUNITY:
      return {
        ...state,
        communities: state.communities.filter(communityId => communityId !== payload.communityId),
      };

    case UNAUTH_CLEAR_COMMUNITIES:
      return {
        ...state,
        communities: initialState.communities,
      };

    case UNAUTH_SET_AIRDROP_COMMUNITY:
      return {
        ...state,
        airdropCommunityId: payload.communityId,
      };

    case AUTH_LOGOUT_SUCCESS:
      if (payload.skipAuthClear) {
        return state;
      }

      return initialState;

    default:
      return state;
  }
}
