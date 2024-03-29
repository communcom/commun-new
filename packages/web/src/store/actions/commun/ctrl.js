import { handleNoBalance } from 'store/actions/commun/point';
import { checkAuth } from 'store/actions/complex/auth';
import { UNREG_LEADER, UNREG_LEADER_ERROR, UNREG_LEADER_SUCCESS } from 'store/constants';
import {
  BECOME_LEADER,
  BECOME_LEADER_ERROR,
  BECOME_LEADER_SUCCESS,
  CLEAR_LEADER_VOTES,
  CLEAR_LEADER_VOTES_ERROR,
  CLEAR_LEADER_VOTES_SUCCESS,
  STOP_LEADER,
  STOP_LEADER_ERROR,
  STOP_LEADER_SUCCESS,
  UNVOTE_LEADER,
  UNVOTE_LEADER_ERROR,
  UNVOTE_LEADER_SUCCESS,
  VOTE_LEADER,
  VOTE_LEADER_ERROR,
  VOTE_LEADER_SUCCESS,
} from 'store/constants/actionTypes';
import { COMMUN_API } from 'store/middlewares/commun-api';

const CONTRACT_NAME = 'ctrl';

const createVoteLeaderAction = (methodName, types, defaultValues) => ({
  communityId,
  leaderId,
}) => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  return dispatch(
    handleNoBalance(communityId, {
      [COMMUN_API]: {
        types,
        contract: CONTRACT_NAME,
        method: methodName,
        params: {
          ...defaultValues,
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

export const voteLeader = createVoteLeaderAction(
  'voteleader',
  [VOTE_LEADER, VOTE_LEADER_SUCCESS, VOTE_LEADER_ERROR],
  { pct: null }
);

export const unVoteLeader = createVoteLeaderAction('unvotelead', [
  UNVOTE_LEADER,
  UNVOTE_LEADER_SUCCESS,
  UNVOTE_LEADER_ERROR,
]);

export const becomeLeader = ({ communityId, url }) => async dispatch => {
  const userId = await dispatch(checkAuth());

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

export const clearVotes = ({ communityId, count = null }) => async dispatch => {
  const userId = await dispatch(checkAuth());

  const params = {
    commun_code: communityId,
    leader: userId,
    count, // bc uses max value if doesn't specified
  };

  return dispatch({
    [COMMUN_API]: {
      types: [CLEAR_LEADER_VOTES, CLEAR_LEADER_VOTES_SUCCESS, CLEAR_LEADER_VOTES_ERROR],
      contract: CONTRACT_NAME,
      method: 'clearvotes',
      params,
    },
    meta: {
      communityId,
      userId,
      count,
    },
  });
};

export const unregLeader = ({ communityId }) => async dispatch => {
  const userId = await dispatch(checkAuth());

  return dispatch({
    [COMMUN_API]: {
      types: [UNREG_LEADER, UNREG_LEADER_SUCCESS, UNREG_LEADER_ERROR],
      contract: CONTRACT_NAME,
      method: 'unregleader',
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

export const claimLeader = communityId => async dispatch => {
  const userId = await dispatch(checkAuth());

  const params = {
    commun_code: communityId,
    leader: userId,
  };

  return dispatch({
    [COMMUN_API]: {
      contract: CONTRACT_NAME,
      method: 'claim',
      params,
    },
    meta: params,
  });
};
