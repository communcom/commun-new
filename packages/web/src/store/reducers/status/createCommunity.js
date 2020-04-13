import {
  COMMUNITY_CREATION_SET_RULE,
  COMMUNITY_CREATION_REMOVE_RULE,
  COMMUNITY_CREATION_RESTORE_DATA,
  COMMUNITY_CREATION_REMOVE_DATA,
} from 'store/constants/actionTypes';

const initialState = {
  isRulesChanged: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case COMMUNITY_CREATION_SET_RULE:
    case COMMUNITY_CREATION_REMOVE_RULE:
    case COMMUNITY_CREATION_RESTORE_DATA:
      return {
        ...state,
        isRulesChanged: true,
      };

    case COMMUNITY_CREATION_REMOVE_DATA:
      return initialState;

    default:
      return state;
  }
}
