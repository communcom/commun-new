/* eslint-disable no-param-reassign */

import { path, map, uniq, without } from 'ramda';
import u from 'updeep';

import {
  SET_COMMENT_VOTE,
  DELETE_COMMENT_SUCCESS,
  FETCH_POST_COMMENT_SUCCESS,
  FETCH_POST_COMMENTS_NESTED_SUCCESS,
} from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
import { applyVote } from 'store/utils/votes';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = path(['entities', 'postComments'], payload);

  if (entities) {
    state = {
      ...state,
      ...map(
        comment => ({
          type: 'comment',
          children: [], // sometimes doesn't exists TODO: server
          childrenNew: [],
          ...comment,
          id: formatContentId(comment.contentId),
        }),
        entities
      ),
    };
  }

  switch (type) {
    case FETCH_POST_COMMENT_SUCCESS: {
      if (meta.parentCommentId) {
        const parentCommentId = formatContentId(meta.parentCommentId);

        if (state[parentCommentId]) {
          const ids = uniq((state[parentCommentId].childrenNew || []).concat([payload.result]));

          return u.updateIn([parentCommentId, 'childrenNew'], ids, state);
        }
      }

      return state;
    }

    case FETCH_POST_COMMENTS_NESTED_SUCCESS: {
      const commentId = formatContentId(meta.parentComment);
      if (state[commentId]) {
        let ids;

        if (meta.offset) {
          ids = uniq((state[commentId].children || []).concat(payload.result.items));
        } else {
          ids = payload.result.items;
        }

        return u.updateIn(
          commentId,
          {
            children: ids,
            childrenNew: items => without(ids, items),
          },
          state
        );
      }
      return state;
    }

    // optimistic
    case SET_COMMENT_VOTE:
      if (state[payload.id]) {
        return applyVote(state, payload, meta);
      }
      return state;

    case DELETE_COMMENT_SUCCESS: {
      if (state[meta.commentId]) {
        return u.updateIn(
          meta.commentId,
          {
            document: null,
            isDeleted: true,
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
