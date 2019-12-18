import u from 'updeep';

import { SET_POST_VOTE, RECORD_POST_VIEW } from 'store/constants';
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
        // TODO: change for same field from backend then it will be done - https://github.com/communcom/prism/issues/254
        isViewed: false,
      }),
      merge: (newPost, cachedPost) => ({
        ...cachedPost,
        ...newPost,
        isViewed: cachedPost.isViewed || false,
      }),
    });
  }

  switch (type) {
    // optimistic
    case SET_POST_VOTE:
      if (state[payload.id]) {
        return applyVote(state, payload, meta);
      }
      return state;

    // optimistic
    case RECORD_POST_VIEW:
      // has post but doesn't viewed
      if (state[meta.contentUrl] && !state[meta.contentUrl].isViewed) {
        return u.updateIn(
          [meta.contentUrl],
          {
            viewsCount: viewsCount => viewsCount + 1,
            isViewed: true,
          },
          state
        );
      }
      return state;

    default:
      return state;
  }
}
