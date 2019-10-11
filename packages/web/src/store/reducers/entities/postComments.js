import { path, map } from 'ramda';
import u from 'updeep';

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
