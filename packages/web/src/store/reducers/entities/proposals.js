/* eslint-disable no-param-reassign */

import u from 'updeep';

import { mergeEntities } from 'utils/store';
import { APPROVE_PROPOSAL_SUCCESS } from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const proposals = payload?.entities?.proposals;

  if (proposals) {
    state = mergeEntities(state, proposals, {
      merge: true,
    });
  }

  switch (type) {
    case APPROVE_PROPOSAL_SUCCESS: {
      const id = `${meta.communityId}/${meta.proposer}/${meta.proposalId}`;

      return u.updateIn(
        [id],
        proposal => ({
          approvesCount: proposal.approvesCount + 1,
          isApproved: true,
        }),
        state
      );
    }

    default:
      return state;
  }
}
