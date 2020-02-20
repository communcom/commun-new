import { BEGIN, COMMIT, REVERT } from 'redux-optimist';

import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  BLOCK_COMMUNITY,
  UNBLOCK_COMMUNITY,
} from 'store/constants';
import { checkAuth } from 'store/actions/complex/auth';
import {
  openCommunityWalletIfNeed,
  getIsAllowedFollowCommunity,
  unfollowCommunityIfNeed,
} from 'store/actions/complex/communities';
import { DeclineError } from 'utils/errors';

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
  return communityId => async dispatch => {
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
    };

    return dispatch(callListContract(methodName, actionName, data, meta, transactionID));
  };
}

export const joinCommunity = followActionFactory(COMMUNITY_ACTIONS.FOLLOW, JOIN_COMMUNITY);
export const leaveCommunity = followActionFactory(COMMUNITY_ACTIONS.UNFOLLOW, LEAVE_COMMUNITY);

export const blockCommunity = followActionFactory(COMMUNITY_ACTIONS.BLOCK, BLOCK_COMMUNITY);
export const unblockCommunity = followActionFactory(COMMUNITY_ACTIONS.UNBLOCK, UNBLOCK_COMMUNITY);
