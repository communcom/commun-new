/* eslint-disable no-param-reassign */

import map from 'ramda/src/map';
import path from 'ramda/src/path';
import u from 'updeep';

import { DELETE_COMMENT_SUCCESS, FETCH_PROPOSAL_SUCCESS, SET_COMMENT_VOTE } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
import { applyCommentsUpdates } from 'store/utils/comments';
import { applyVote } from 'store/utils/votes';

const initialState = {};

export default function reducerEntitiesProfileComments(
  state = initialState,
  { type, payload, meta }
) {
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

  state = applyCommentsUpdates(state, payload);

  switch (type) {
    // optimistic
    case SET_COMMENT_VOTE:
      if (state[payload.id]) {
        return applyVote(state, payload, meta);
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

    case FETCH_PROPOSAL_SUCCESS: {
      const { proposal } = payload.originalResult;

      if (proposal.contentType === 'comment') {
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

    default:
      return state;
  }
}
