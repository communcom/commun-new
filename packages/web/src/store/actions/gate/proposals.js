/* eslint-disable import/prefer-default-export */

import { CALL_GATE } from 'store/middlewares/gate-api';

import { FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR } from 'store/constants';
import { proposalSchema } from 'store/schemas/gate';
import { prepareLeaderCommunitiesSelector } from 'store/selectors/community';

export const fetchLeaderProposals = ({ communityIds, limit = 20, offset = 0, stayCurrentData }) => (
  dispatch,
  getState
) => {
  const ids = prepareLeaderCommunitiesSelector(communityIds)(getState());

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR],
      method: 'content.getProposals',
      params: {
        communityIds: ids,
        limit,
        offset,
      },
      schema: {
        items: [proposalSchema],
      },
    },
    meta: {
      communityIds: ids,
      limit,
      offset,
      stayCurrentData,
      waitAutoLogin: true,
    },
  });
};
