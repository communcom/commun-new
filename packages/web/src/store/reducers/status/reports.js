import { uniq } from 'ramda';
import u from 'updeep';

import {
  FETCH_REPORTS_ENTITY,
  FETCH_REPORTS_ENTITY_ERROR,
  FETCH_REPORTS_ENTITY_SUCCESS,
} from 'store/constants/actionTypes';
import { formatContentId } from 'store/schemas/gate';

const initialReportsState = {
  order: [],
  orderNew: [],
  isLoading: false,
  isEnd: false,
};

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  if (
    type === FETCH_REPORTS_ENTITY ||
    type === FETCH_REPORTS_ENTITY_SUCCESS ||
    type === FETCH_REPORTS_ENTITY_ERROR
  ) {
    const contentId = formatContentId({
      communityId: meta.communityId,
      userId: meta.userId,
      permlink: meta.permlink,
    });

    switch (type) {
      case FETCH_REPORTS_ENTITY: {
        if (meta.offset) {
          return u.updateIn(contentId, { isLoading: true }, state);
        }

        return u.updateIn(contentId, { ...initialReportsState, isLoading: true }, state);
      }

      case FETCH_REPORTS_ENTITY_SUCCESS: {
        let order;

        if (meta.offset) {
          order = uniq(state[contentId].order.concat(payload.result.items));
        } else {
          order = payload.result.items;
        }

        return u.updateIn(
          contentId,
          {
            isLoading: false,
            order,
            isEnd: payload.result.items.length < meta.limit,
          },
          state
        );
      }

      case FETCH_REPORTS_ENTITY_ERROR: {
        return u.updateIn(contentId, { isLoading: false }, state);
      }

      default:
        return state;
    }
  }

  return state;
}
