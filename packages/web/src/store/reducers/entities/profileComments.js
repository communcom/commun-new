/* eslint-disable no-param-reassign */

import { path, map } from 'ramda';
import u from 'updeep';

import { SET_COMMENT_VOTE, DELETE_COMMENT_SUCCESS } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = path(['entities', 'profileComments'], payload);

  if (entities) {
    state = {
      ...state,
      ...map(
        comment => ({
          type: 'comment',
          ...comment,
          id: formatContentId(comment.contentId),
        }),
        entities
      ),
    };
  }

  switch (type) {
    case SET_COMMENT_VOTE:
      if (state[payload.id]) {
        return u.updateIn([payload.id, 'votes'], payload.votes, state);
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
