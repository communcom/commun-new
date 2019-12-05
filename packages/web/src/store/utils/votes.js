import u from 'updeep';

import { DOWNVOTE, UPVOTE } from 'shared/constants';

// eslint-disable-next-line import/prefer-default-export
export function applyVote(state, payload, meta) {
  return u.updateIn(
    [payload.id, 'votes'],
    votes => {
      let { upCount, downCount } = votes;

      if (votes.hasUpVote) {
        upCount--;
      }

      if (votes.hasDownVote) {
        downCount--;
      }

      switch (meta.action) {
        case UPVOTE:
          upCount++;
          break;
        case DOWNVOTE:
          downCount++;
          break;
        default:
        // Do nothing
      }

      return {
        ...votes,
        upCount,
        downCount,
        hasUpVote: meta.action === UPVOTE,
        hasDownVote: meta.action === DOWNVOTE,
      };
    },
    state
  );
}
