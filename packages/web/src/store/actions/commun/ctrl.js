import { COMMUN_API } from 'store/middlewares/commun-api';

import {
  VOTE_LEADER,
  UNVOTE_LEADER,
  BECOME_LEADER,
  BECOME_LEADER_SUCCESS,
  BECOME_LEADER_ERROR,
  STOP_LEADER,
  STOP_LEADER_SUCCESS,
  STOP_LEADER_ERROR,
} from 'store/constants/actionTypes';
import { checkAuth } from 'store/actions/complex';
import { handleNoBalance } from 'store/actions/commun';

const CONTRACT_NAME = 'ctrl';

const createVoteLeaderAction = (methodName, actionName) => ({
  communityId,
  leaderId,
}) => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  return dispatch(
    handleNoBalance(communityId, {
      [COMMUN_API]: {
        types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
        contract: CONTRACT_NAME,
        method: methodName,
        params: {
          commun_code: communityId,
          voter: loggedUserId,
          leader: leaderId,
        },
      },
      meta: {
        communityId,
        leaderId,
        userId: loggedUserId,
      },
    })
  );
};

export const voteLeader = createVoteLeaderAction('voteleader', VOTE_LEADER);
export const unVoteLeader = createVoteLeaderAction('unvotelead', UNVOTE_LEADER);

export const becomeLeader = ({ communityId, url }) => async dispatch => {
  const userId = await dispatch(checkAuth());

  await dispatch({
    [COMMUN_API]: {
      types: [BECOME_LEADER, BECOME_LEADER_SUCCESS, BECOME_LEADER_ERROR],
      contract: CONTRACT_NAME,
      method: 'regleader',
      params: {
        commun_code: communityId,
        leader: userId,
        url,
      },
    },
    meta: {
      userId,
      communityId,
    },
  });
};

export const stopLeader = ({ communityId }) => async dispatch => {
  const userId = await dispatch(checkAuth());

  return dispatch({
    [COMMUN_API]: {
      types: [STOP_LEADER, STOP_LEADER_SUCCESS, STOP_LEADER_ERROR],
      contract: CONTRACT_NAME,
      method: 'stopleader',
      params: {
        commun_code: communityId,
        leader: userId,
      },
    },
    meta: {
      userId,
      communityId,
    },
  });
};
