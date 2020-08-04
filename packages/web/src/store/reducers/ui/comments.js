import { SORT_BY_OLDEST } from 'shared/constants';
import { SET_COMMENTS_FILTER } from 'store/constants/actionTypes';

const initialState = {
  filterSortBy: SORT_BY_OLDEST,
};

export default function reducerUiComments(state = initialState, { type, payload }) {
  switch (type) {
    case SET_COMMENTS_FILTER:
      return {
        filterSortBy: payload.filter,
      };

    default:
      return state;
  }
}
