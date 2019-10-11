import { path, map } from 'ramda';
import u from 'updeep';

import { SET_COMMENT_VOTE } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const entities = path(['entities', 'profileComments'], payload);

  if (entities) {
    return {
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

    default:
      return state;
  }
}
