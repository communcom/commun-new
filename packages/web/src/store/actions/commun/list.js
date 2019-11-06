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

function makeCommunityAction(methodName, types) {
  return communityId => async dispatch => {
    const userId = await dispatch(checkAuth());

    const data = {
      commun_code: communityId,
      follower: userId,
    };

    return dispatch({
      [COMMUN_API]: {
        types,
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
