import { uniq, without } from 'ramda';
import u from 'updeep';

import {
  FETCH_POST_COMMENT_SUCCESS,
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
  DELETE_CONTENT_SUCCESS,
} from 'store/constants/actionTypes';
import { formatContentId } from 'store/schemas/gate';

const initialPostCommentState = {
  order: [],
  orderNew: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
};

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
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

      // Если передан sequenceKey и он соответствует текущей ленте то просто добавляем новые посты
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

    case DELETE_CONTENT_SUCCESS: {
      const postId = formatContentId(meta.parentContentId);

      if (state[postId]) {
        const id = formatContentId({
          userId: meta.message_id.author,
          permlink: meta.message_id.permlink,
        });

        return u.updateIn(
          postId,
          {
            order: items => items.filter(currentId => currentId !== id),
          },
          state
        );
      }

      return state;
    }

    default:
      return state;
  }
}
