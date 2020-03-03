import { uniq } from 'ramda';
import {
  UNAUTH_CLEAR_COMMUNITIES,
  AUTH_LOGOUT_SUCCESS,
  UNAUTH_ADD_COMMUNITY,
  UNAUTH_REMOVE_COMMUNITY,
} from 'store/constants';

const initialState = {
  communities: [],
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case UNAUTH_ADD_COMMUNITY:
      return {
        ...state,
        communities: uniq(state.communities.concat(payload.communityId)),
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

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
