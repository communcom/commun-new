import u from 'updeep';

import { SET_POST_VOTE, RECORD_POST_VIEW_SUCCESS } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
import { mergeEntities } from 'utils/store';
import { applyVote } from 'store/utils/votes';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = payload?.entities?.posts;

  if (entities) {
    return mergeEntities(state, entities, {
      transform: post => ({
        ...post,
        type: 'post',
        id: formatContentId(post.contentId),
      }),
      merge: true,
    });
  }

  switch (type) {
    // optimistic
    case SET_POST_VOTE:
      if (state[payload.id]) {
        return applyVote(state, payload, meta);
      }
      return state;
    case RECORD_POST_VIEW_SUCCESS:
      if (state[meta.contentUrl]) {
        return u.updateIn([meta.contentUrl, 'viewsCount'], viewsCount => viewsCount + 1, state);
      }
      return state;

    default:
      return state;
  }
}
