import u from 'updeep';

import {
  SET_POST_VOTE,
  RECORD_POST_VIEW,
  SET_BAN_POST_PROPOSAL,
  FETCH_PROPOSAL_SUCCESS,
  DELETE_POST_SUCCESS,
} from 'store/constants';
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
            viewsCount: viewsCount => (Number.isFinite(viewsCount) ? viewsCount + 1 : viewsCount),
            isViewed: true,
          },
          state
        );
      }
      return state;

    case SET_BAN_POST_PROPOSAL:
      if (state[payload.contentUrl]) {
        return u.updateIn(
          [payload.contentUrl],
          {
            proposal: payload.fullProposalId,
          },
          state
        );
      }
      return state;

    case FETCH_PROPOSAL_SUCCESS: {
      const { proposal } = payload.originalResult;

      if (proposal.contentType === 'post') {
        const id = `${proposal.communityId}/${proposal.data.message_id.author}/${proposal.data.message_id.permlink}`;

        if (state[id]) {
          return u.updateIn(
            id,
            {
              proposal: payload.result.proposal,
            },
            state
          );
        }
      }

      return state;
    }

    case DELETE_POST_SUCCESS: {
      if (state[meta.postId]) {
        return u.omit(meta.postId, state);
      }
      return state;
    }

    default:
      return state;
  }
}
