import { path, map } from 'ramda';
import update from 'immutability-helper';

import { SET_COMMENT_VOTE, DELETE_CONTENT_SUCCESS } from 'store/constants';
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
          ...comment,
          id: formatContentId(comment.contentId),
        }),
        entities
      ),
    };
  }

  switch (type) {
    case SET_COMMENT_VOTE:
      if (newState[payload.id]) {
        return update(newState, {
          [payload.id]: {
            votes: {
              $set: payload.votes,
            },
          },
        });
      }
      return newState;

    case DELETE_CONTENT_SUCCESS: {
      const id = formatContentId(meta.contentId);

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
