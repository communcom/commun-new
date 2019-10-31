/* eslint-disable import/prefer-default-export */

import { CALL_GATE } from 'store/middlewares/gate-api';

import { FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR } from 'store/constants';
import { proposalSchema } from 'store/schemas/gate';

export const fetchLeaderProposals = ({ communitiesIds, limit = 20, offset = 0 }) => ({
  [CALL_GATE]: {
    types: [FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR],
    method: 'content.getProposals',
    params: {
      communitiesIds,
      limit,
      offset,
    },
    schema: {
      items: [proposalSchema],
    },
  },
  meta: {
    communitiesIds,
    limit,
    offset,
    waitAutoLogin: true,
  },
});
