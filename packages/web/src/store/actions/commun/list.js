import { BEGIN, COMMIT, REVERT } from 'redux-optimist';

import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  JOIN_COMMUNITY,
  JOIN_COMMUNITY_SUCCESS,
  JOIN_COMMUNITY_ERROR,
  LEAVE_COMMUNITY,
  LEAVE_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_ERROR,
} from 'store/constants';
import { checkAuth } from 'store/actions/complex/auth';

let nextTransactionID = 0;

function makeCommunityAction(methodName, types) {
  return communityId => async dispatch => {
    const userId = await dispatch(checkAuth(true));
    const transactionID = `${types[0]}-${nextTransactionID++}`;

    const data = {
      commun_code: communityId,
      follower: userId,
    };

    let result;

    // optimistic
    dispatch({
      type: types[0],
      meta: {
        userId,
        communityId,
      },
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
        meta: {
          userId,
          communityId,
        },
      });

      dispatch({
        type: types[1],
        optimist: { type: COMMIT, id: transactionID },
      });
    } catch (e) {
      dispatch({
        type: types[2],
        optimist: { type: REVERT, id: transactionID },
      });
      throw e;
    }

    return result;
  };
}

export const joinCommunity = makeCommunityAction('follow', [
  JOIN_COMMUNITY,
  JOIN_COMMUNITY_SUCCESS,
  JOIN_COMMUNITY_ERROR,
]);

export const leaveCommunity = makeCommunityAction('unfollow', [
  LEAVE_COMMUNITY,
  LEAVE_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_ERROR,
]);
