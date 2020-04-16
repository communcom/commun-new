/* eslint-disable import/prefer-default-export */
import {
  FETCH_VOTED_LEADER,
  FETCH_VOTED_LEADER_SUCCESS,
  FETCH_VOTED_LEADER_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchVotedLeader = ({ communityId, userId }) => {
  const params = {
    communityId,
    userId,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_VOTED_LEADER, FETCH_VOTED_LEADER_SUCCESS, FETCH_VOTED_LEADER_ERROR],
      method: 'content.getVotedLeader',
      params,
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};
