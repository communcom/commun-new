import {
  FETCH_COMMUNITIES_BLACKLIST,
  FETCH_COMMUNITIES_BLACKLIST_SUCCESS,
  FETCH_COMMUNITIES_BLACKLIST_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_COMMUNITIES_BLACKLIST:
      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_COMMUNITIES_BLACKLIST_SUCCESS: {
      return {
        ...state,
        order: payload.result.items,
        isLoading: false,
      };
    }

    case FETCH_COMMUNITIES_BLACKLIST_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
