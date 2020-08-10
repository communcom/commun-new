import uniq from 'ramda/src/uniq';

import {
  CLEAR_COMMUNITY_FILTER,
  SELECT_COMMUNITY,
  SET_SELECTED_COMMUNITIES,
} from 'store/constants';

const initialState = {
  selectedCommunities: undefined,
  isLoaded: false,
};

export default function reducerUiLeaderboard(state = initialState, { type, payload }) {
  switch (type) {
    case SELECT_COMMUNITY: {
      const { action, communityId } = payload;
      const current = state.selectedCommunities;
      let updatedSelected;

      switch (action) {
        case 'select':
          updatedSelected = [communityId];
          break;
        case 'add':
          updatedSelected = uniq(current.concat(communityId));
          break;
        case 'remove':
          updatedSelected = current.filter(id => id !== communityId);
          break;
        default:
          throw new Error('Invariant');
      }

      return {
        ...state,
        selectedCommunities: updatedSelected,
      };
    }

    case CLEAR_COMMUNITY_FILTER: {
      return {
        ...state,
        selectedCommunities: [],
      };
    }

    case SET_SELECTED_COMMUNITIES:
      return {
        selectedCommunities: payload.communities,
        isLoaded: true,
      };

    default:
      return state;
  }
}