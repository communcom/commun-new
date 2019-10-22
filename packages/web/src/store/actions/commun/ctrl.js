import { COMMUN_API } from 'store/middlewares/commun-api';

import {
  VOTE_LEADER,
  UNVOTE_LEADER,
  BECOME_LEADER,
  BECOME_LEADER_SUCCESS,
  BECOME_LEADER_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'ctrl';

const voteCommunityLeaderAction = (methodName, actionName) => witness => async (
  dispatch,
  getState
) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

  const data = {
    voter: loggedUserId,
    witness,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: CONTRACT_NAME,
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const voteCommunityLeader = voteCommunityLeaderAction('votewitness', VOTE_LEADER);
export const unvoteCommunityLeader = voteCommunityLeaderAction('unvotewitn', UNVOTE_LEADER);

export const becomeLeader = ({ communityId, url }) => async (dispatch, getState) => {
  const state = getState();

  const userId = currentUserIdSelector(state);

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return dispatch({
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
