import { uniq } from 'ramda';

import {
  SELECT_COMMUNITY,
  SET_SELECTED_COMMUNITIES,
  SELECT_ALL_COMMUNITIES,
} from 'store/constants';

const initialState = {
  selectedCommunities: undefined,
  isLoaded: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SELECT_COMMUNITY: {
      let updatedSelected;

      if (payload.isSelected) {
        updatedSelected = uniq(state.selectedCommunities.concat(payload.communityId));
      } else {
        updatedSelected = state.selectedCommunities.filter(
          communityId => communityId !== payload.communityId
        );
      }

      return {
        ...state,
        selectedCommunities: updatedSelected,
      };
    }

    case SELECT_ALL_COMMUNITIES: {
      return {
        ...state,
        selectedCommunities: payload.isSelected ? 'all' : 'none',
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
};
