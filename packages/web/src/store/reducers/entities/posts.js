/* eslint-disable camelcase */
import u from 'updeep';

import { mergeEntities } from 'utils/store';
import {
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  FETCH_PROPOSAL_SUCCESS,
  RECORD_POST_VIEW,
  SET_BAN_POST_PROPOSAL,
  SET_POST_VOTE,
} from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
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

    case CREATE_POST_SUCCESS: {
      const { parent_id, commun_code } = meta;

      if (parent_id) {
        const id = formatContentId({
          communityId: commun_code,
          userId: parent_id.author,
          permlink: parent_id.permlink,
        });

        if (state[id]) {
          return u.updateIn(
            [id, 'stats'],
            stats => ({
              ...stats,
              commentsCount: stats.commentsCount + 1,
            }),
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
