import uniq from 'ramda/src/uniq';
import without from 'ramda/src/without';
import u from 'updeep';

import {
  FETCH_POST_COMMENT_SUCCESS,
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_ERROR,
  FETCH_POST_COMMENTS_SUCCESS,
} from 'store/constants/actionTypes';
import { formatContentId } from 'store/schemas/gate';

const initialPostCommentState = {
  order: [],
  orderNew: [],
  isLoading: false,
  isEnd: false,
};

const initialState = {};

export default function reducerStatusPostComments(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_POST_COMMENT_SUCCESS: {
      if (meta.parentPostId && !meta.parentCommentId) {
        const parentPostId = formatContentId(meta.parentPostId);
        const ids = uniq((state[parentPostId].orderNew || []).concat([payload.result]));

        return u.updateIn([parentPostId, 'orderNew'], ids, state);
      }
      return state;
    }

    case FETCH_POST_COMMENTS: {
      const postId = formatContentId(meta.contentId);

      if (meta.offset) {
        return u.updateIn(postId, { isLoading: true }, state);
      }

      return u.updateIn(postId, { ...initialPostCommentState, isLoading: true }, state);
    }

    case FETCH_POST_COMMENTS_SUCCESS: {
      const postId = formatContentId(meta.contentId);
      let order;

      if (meta.offset) {
        order = uniq(state[postId].order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return u.updateIn(
        postId,
        {
          isLoading: false,
          order,
          orderNew: items => without(order, items),
          isEnd: payload.result.items.length < meta.limit,
        },
        state
      );
    }

    case FETCH_POST_COMMENTS_ERROR: {
      const postId = formatContentId(meta.contentId);

      return u.updateIn(postId, { isLoading: false }, state);
    }

    default:
      return state;
  }
}
