/* eslint-disable no-param-reassign */

import u from 'updeep';

import { mergeEntities } from 'utils/store';
import { APPROVE_PROPOSAL_SUCCESS, CANCEL_PROPOSAL_APPROVE_SUCCESS } from 'store/constants';

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

      if (state[id]) {
        return u.updateIn(
          [id],
          proposal => ({
            ...proposal,
            approvesCount: proposal.approvesCount + 1,
            isApproved: true,
          }),
          state
        );
      }

      return state;
    }

    case CANCEL_PROPOSAL_APPROVE_SUCCESS: {
      const id = `${meta.communityId}/${meta.proposer}/${meta.proposalId}`;

      if (state[id]) {
        return u.updateIn(
          [id],
          proposal => ({
            ...proposal,
            approvesCount: Math.max(0, proposal.approvesCount - 1),
            isApproved: false,
          }),
          state
        );
      }

      return state;
    }

    default:
      return state;
  }
}
