import {
  FETCH_TRENDING_COMMUNITIES,
  FETCH_TRENDING_COMMUNITIES_SUCCESS,
  FETCH_TRENDING_COMMUNITIES_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isLoaded: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_TRENDING_COMMUNITIES:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_TRENDING_COMMUNITIES_SUCCESS:
      return {
        ...state,
        order: payload.result.items,
        isLoading: false,
        isLoaded: true,
      };

    case FETCH_TRENDING_COMMUNITIES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
