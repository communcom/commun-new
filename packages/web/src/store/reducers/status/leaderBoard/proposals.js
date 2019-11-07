import { uniq } from 'ramda';

import { FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR } from 'store/constants';

const initialState = {
  order: [],
  communitiesKey: null,
  loadingCommunitiesKey: null,
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_PROPOSALS:
    case FETCH_PROPOSALS_SUCCESS:
    case FETCH_PROPOSALS_ERROR: {
      const communitiesKey = [...(meta.communityIds || [])].sort().join(';');
      let isSameKey;

      if (meta.stayCurrentData) {
        isSameKey = communitiesKey === state.loadingCommunitiesKey;
      } else {
        isSameKey = communitiesKey === state.communitiesKey;
      }

      switch (type) {
        case FETCH_PROPOSALS:
          if (meta.stayCurrentData) {
            return {
              ...state,
              loadingCommunitiesKey: communitiesKey,
              isLoading: true,
            };
          }

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

        case FETCH_PROPOSALS_SUCCESS: {
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
            loadingCommunitiesKey: null,
            isLoading: false,
            isEnd: payload.result.items.length < meta.limit,
          };
        }

        case FETCH_PROPOSALS_ERROR: {
          if (!isSameKey) {
            return state;
          }

          return {
            ...state,
            loadingCommunitiesKey: null,
            isLoading: false,
          };
        }

        default:
          return state;
      }
    }

    default:
      return state;
  }
}
