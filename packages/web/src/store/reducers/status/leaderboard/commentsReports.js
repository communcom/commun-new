import uniq from 'ramda/src/uniq';

import {
  FETCH_COMMENTS_REPORTS_LIST,
  FETCH_COMMENTS_REPORTS_LIST_ERROR,
  FETCH_COMMENTS_REPORTS_LIST_SUCCESS,
  REMOVE_REPORT,
} from 'store/constants';

const initialState = {
  order: [],
  communitiesKey: null,
  isLoading: false,
  isEnd: false,
};

export default function reducerStatusWidgetsLeaderboardCommentsReports(
  state = initialState,
  { type, payload, meta }
) {
  switch (type) {
    case FETCH_COMMENTS_REPORTS_LIST:
    case FETCH_COMMENTS_REPORTS_LIST_SUCCESS:
    case FETCH_COMMENTS_REPORTS_LIST_ERROR: {
      const communitiesKey = [...(meta.communityIds || [])].sort().join(';');
      const isSameKey = communitiesKey === state.communitiesKey;

      switch (type) {
        case FETCH_COMMENTS_REPORTS_LIST:
          if (isSameKey && meta.offset) {
            return {
              ...state,
              isLoading: true,
            };
          }

          return {
            ...initialState,
            communitiesKey,
            isLoading: true,
            isEnd: false,
          };

        case FETCH_COMMENTS_REPORTS_LIST_SUCCESS: {
          if (!isSameKey) {
            return state;
          }

          let order;

          if (meta.offset) {
            order = uniq(state.order.concat(payload.result.items));
          } else {
            order = payload.result.items;
          }

          return {
            ...state,
            order,
            communitiesKey,
            isLoading: false,
            isEnd: payload.result.items.length < meta.limit,
          };
        }

        case FETCH_COMMENTS_REPORTS_LIST_ERROR: {
          if (!isSameKey) {
            return state;
          }

          return {
            ...state,
            isLoading: false,
          };
        }

        default:
          return state;
      }
    }

    case REMOVE_REPORT:
      return {
        ...state,
        order: state.order.filter(id => id !== payload.contentUrl),
      };

    default:
      return state;
  }
}
