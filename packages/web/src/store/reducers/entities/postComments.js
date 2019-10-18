import { path, map, uniq, without } from 'ramda';
import u from 'updeep';

import {
  SET_COMMENT_VOTE,
  DELETE_CONTENT_SUCCESS,
  FETCH_POST_COMMENT_SUCCESS,
  FETCH_POST_COMMENTS_NESTED_SUCCESS,
} from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  let newState = state;
  const entities = path(['entities', 'postComments'], payload);

  if (entities) {
    newState = {
      ...newState,
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
        const ids = uniq((newState[parentCommentId].childrenNew || []).concat([payload.result]));

        return u.updateIn([parentCommentId, 'childrenNew'], ids, newState);
      }

      return newState;
    }

    case FETCH_POST_COMMENTS_NESTED_SUCCESS: {
      const commentId = formatContentId(meta.parentComment);
      if (newState[commentId]) {
        let ids;

        if (meta.offset) {
          ids = uniq((newState[commentId].children || []).concat(payload.result.items));
        } else {
          ids = payload.result.items;
        }

        return u.updateIn(
          [commentId],
          {
            children: ids,
            childrenNew: items => without(ids, items),
          },
          newState
        );
      }
      return newState;
    }

    case SET_COMMENT_VOTE:
      if (newState[payload.id]) {
        return u.updateIn([payload.id, 'votes'], payload.votes, newState);
      }
      return newState;

    case DELETE_CONTENT_SUCCESS: {
      const id = formatContentId({
        userId: meta.message_id.author,
        permlink: meta.message_id.permlink,
      });

      if (newState[id]) {
        return {
          ...newState,
          [id]: undefined,
        };
      }

      return newState;
    }

    default:
      return newState;
  }
}
