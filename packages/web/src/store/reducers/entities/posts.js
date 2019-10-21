import u from 'updeep';

import { SET_POST_VOTE, RECORD_POST_VIEW_SUCCESS } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = payload?.entities?.posts;

  if (entities) {
    return mergeEntities(state, entities, {
      transform: post => ({
        ...post,
        type: 'post',
        id: formatContentId(post.contentId),
        stats: {
          ...post.stats,
          viewCount: post.stats?.viewCount || 0,
        },
      }),
      merge: true,
    });
  }

  switch (type) {
    case SET_POST_VOTE:
      if (state[payload.id]) {
        return u.updateIn([payload.id, 'votes'], payload.votes, state);
      }
      return state;
    case RECORD_POST_VIEW_SUCCESS:
      if (state[meta.contentUrl]) {
        return u.updateIn(
          [meta.contentUrl, 'stats', 'viewCount'],
          viewCount => viewCount + 1,
          state
        );
      }
      return state;
    default:
      return state;
  }
}
