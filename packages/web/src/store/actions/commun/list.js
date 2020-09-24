import { BEGIN, COMMIT, REVERT } from 'redux-optimist';

import { DeclineError } from 'utils/errors';
import { checkAuth } from 'store/actions/complex/auth';
import {
  getIsAllowedFollowCommunity,
  openCommunityWalletIfNeed,
  unfollowCommunityIfNeed,
} from 'store/actions/complex/communities';
import {
  BAN_COMMUNITY_USER,
  BAN_COMMUNITY_USER_ERROR,
  BAN_COMMUNITY_USER_SUCCESS,
  BLOCK_COMMUNITY,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  UNBAN_COMMUNITY_USER,
  UNBAN_COMMUNITY_USER_ERROR,
  UNBAN_COMMUNITY_USER_SUCCESS,
  UNBLOCK_COMMUNITY,
} from 'store/constants';
import { COMMUN_API } from 'store/middlewares/commun-api';

let nextTransactionID = 0;

const COMMUNITY_ACTIONS = {
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',
  BLOCK: 'hide',
  UNBLOCK: 'unhide',
};

function callListContract(methodName, actionName, data, meta, transactionID) {
  return async dispatch => {
    let result;

    // optimistic
    dispatch({
      type: actionName,
      meta,
      optimist: { type: BEGIN, id: transactionID },
    });

    try {
      result = await dispatch({
        [COMMUN_API]: {
          contract: 'list',
          addSystemActor: 'c.list',
          method: methodName,
          params: data,
        },
        meta,
      });

      dispatch({
        type: `${actionName}_SUCCESS`,
        optimist: { type: COMMIT, id: transactionID },
        meta,
      });
    } catch (e) {
      dispatch({
        type: `${actionName}_ERROR`,
        optimist: { type: REVERT, id: transactionID },
        meta,
      });
      throw e;
    }

    return result;
  };
}

function followActionFactory(methodName, actionName) {
  return (communityId, isOnboarding = false) => async dispatch => {
    const userId = await dispatch(checkAuth({ allowLogin: true }));

    switch (methodName) {
      case COMMUNITY_ACTIONS.FOLLOW: {
        const isAllowed = await dispatch(
          getIsAllowedFollowCommunity(
            communityId,
            followActionFactory(COMMUNITY_ACTIONS.UNBLOCK, UNBLOCK_COMMUNITY)
          )
        );

        if (!isAllowed) {
          throw new DeclineError('Declined');
        }

        await dispatch(openCommunityWalletIfNeed(communityId));
        break;
      }

      case COMMUNITY_ACTIONS.BLOCK: {
        await dispatch(
          unfollowCommunityIfNeed(
            communityId,
            followActionFactory(COMMUNITY_ACTIONS.UNFOLLOW, LEAVE_COMMUNITY)
          )
        );
        break;
      }

      default:
    }

    const transactionID = `${actionName}-${nextTransactionID++}`;

    const data = {
      commun_code: communityId,
      follower: userId,
    };

    const meta = {
      userId,
      communityId,
      isOnboarding,
    };

    return dispatch(callListContract(methodName, actionName, data, meta, transactionID));
  };
}

export const joinCommunity = followActionFactory(COMMUNITY_ACTIONS.FOLLOW, JOIN_COMMUNITY);
export const leaveCommunity = followActionFactory(COMMUNITY_ACTIONS.UNFOLLOW, LEAVE_COMMUNITY);

export const blockCommunity = followActionFactory(COMMUNITY_ACTIONS.BLOCK, BLOCK_COMMUNITY);
export const unblockCommunity = followActionFactory(COMMUNITY_ACTIONS.UNBLOCK, UNBLOCK_COMMUNITY);

export const banCommunityUser = ({ communityId, userId, reason }) => async dispatch =>
  dispatch({
    [COMMUN_API]: {
      types: [BAN_COMMUNITY_USER, BAN_COMMUNITY_USER_SUCCESS, BAN_COMMUNITY_USER_ERROR],
      contract: 'list',
      addSystemActor: 'c.list',
      method: 'ban',
      params: {
        commun_code: communityId,
        account: userId,
        reason,
      },
    },
    meta: {
      userId,
      communityId,
      reason,
    },
  });

export const unbanCommunityUser = ({ communityId, userId, reason }) => async dispatch =>
  dispatch({
    [COMMUN_API]: {
      types: [UNBAN_COMMUNITY_USER, UNBAN_COMMUNITY_USER_SUCCESS, UNBAN_COMMUNITY_USER_ERROR],
      contract: 'list',
      addSystemActor: 'c.list',
      method: 'unban',
      params: {
        commun_code: communityId,
        account: userId,
        reason,
      },
    },
    meta: {
      userId,
      communityId,
      reason,
    },
  });
