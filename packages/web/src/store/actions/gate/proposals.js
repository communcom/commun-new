/* eslint-disable import/prefer-default-export */

import {
  FETCH_PROPOSAL,
  FETCH_PROPOSAL_ERROR,
  FETCH_PROPOSAL_SUCCESS,
  FETCH_PROPOSALS,
  FETCH_PROPOSALS_ERROR,
  FETCH_PROPOSALS_SUCCESS,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { proposalSchema } from 'store/schemas/gate';
import { prepareLeaderCommunitiesSelector } from 'store/selectors/community';

export const fetchLeaderProposals = ({
  communityIds,
  types = ['all'],
  limit = 20,
  offset = 0,
  stayCurrentData,
}) => (dispatch, getState) => {
  const ids = prepareLeaderCommunitiesSelector(communityIds)(getState());

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR],
      method: 'content.getProposals',
      params: {
        communityIds: ids,
        types,
        limit,
        offset,
      },
      schema: {
        items: [proposalSchema],
      },
    },
    meta: {
      communityIds: ids,
      types,
      limit,
      offset,
      stayCurrentData,
      waitAutoLogin: true,
    },
  });
};

export const fetchProposal = ({ communityId, proposer, proposalId }) => ({
  [CALL_GATE]: {
    types: [FETCH_PROPOSAL, FETCH_PROPOSAL_SUCCESS, FETCH_PROPOSAL_ERROR],
    method: 'content.getProposal',
    params: { communityId, proposer, proposalId },
    schema: {
      proposal: proposalSchema,
    },
    meta: { communityId, proposer, proposalId },
  },
});

export const fetchPostBanProposal = contentId => ({
  [CALL_GATE]: {
    method: 'content.getBanPostProposal',
    params: contentId,
  },
});
