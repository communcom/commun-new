/* eslint-disable no-use-before-define */
import { BEGIN, COMMIT, REVERT } from 'redux-optimist';

import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  UPDATE_PROFILE_DATA,
  UPDATE_PROFILE_DATA_SUCCESS,
  UPDATE_PROFILE_DATA_ERROR,
  PIN,
  UNPIN,
  BLOCK_USER,
  UNBLOCK_USER,
} from 'store/constants/actionTypes';
import { checkAuth } from 'store/actions/complex/auth';
import { getIsAllowedFollowUser, unfollowUserIfNeed } from 'store/actions/complex/users';
import { DeclineError } from 'utils/errors';

let nextTransactionID = 0;

const META_FIELDS_MATCH = {
  firstName: 'first_name',
  lastName: 'last_name',
  country: 'country',
  city: 'city',
  birthDate: 'birth_date',
  avatarUrl: 'avatar_url',
  coverUrl: 'cover_url',
  biography: 'biography',
  instagram: 'instagram',
  facebook: 'facebook',
  twitter: 'twitter',
  linkedin: 'linkedin',
  github: 'github',
  telegram: 'telegram',
  whatsApp: 'whatsapp',
  weChat: 'wechat',
  website: 'website_url',
};

const SOCIAL_ACTIONS = {
  FOLLOW: 'pin',
  UNFOLLOW: 'unpin',
  BLOCK: 'block',
  UNBLOCK: 'unblock',
};

export const updateProfileMeta = updates => async dispatch => {
  const userId = await dispatch(checkAuth());

  const actualUpdates = {};

  for (const [fieldName, structureFieldName] of Object.entries(META_FIELDS_MATCH)) {
    const value = updates[fieldName];
    actualUpdates[structureFieldName] = typeof value === 'string' ? value : null;
  }

  const data = {
    account: userId,
    meta: actualUpdates,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [UPDATE_PROFILE_DATA, UPDATE_PROFILE_DATA_SUCCESS, UPDATE_PROFILE_DATA_ERROR],
      contract: 'social',
      addSystemActor: 'c.social',
      method: 'updatemeta',
      params: data,
    },
    meta: {
      userId,
      updates,
    },
  });
};

function callSocialContract(methodName, actionName, data, transactionID) {
  return async dispatch => {
    let result;

    // optimistic
    dispatch({
      type: actionName,
      meta: data,
      optimist: {
        type: BEGIN,
        id: transactionID,
      },
    });

    try {
      result = await dispatch({
        [COMMUN_API]: {
          contract: 'social',
          addSystemActor: 'c.social',
          method: methodName,
          params: data,
        },
        meta: data,
      });

      // optimistic
      dispatch({
        type: `${actionName}_SUCCESS`,
        optimist: { type: COMMIT, id: transactionID },
      });
    } catch (e) {
      // optimistic
      dispatch({
        type: `${actionName}_ERROR`,
        optimist: { type: REVERT, id: transactionID },
      });
      throw e;
    }

    return result;
  };
}

function blockActionFactory(methodName, actionName) {
  return userId => async dispatch => {
    const loggedUserId = await dispatch(checkAuth({ allowLogin: true }));
    const transactionID = `${actionName}-${nextTransactionID++}`;

    if (methodName === SOCIAL_ACTIONS.BLOCK) {
      await dispatch(unfollowUserIfNeed(userId, pinActionFactory(SOCIAL_ACTIONS.UNFOLLOW, UNPIN)));
    }

    const data = {
      blocker: loggedUserId,
      blocking: userId,
    };

    return dispatch(callSocialContract(methodName, actionName, data, transactionID));
  };
}

function pinActionFactory(methodName, actionName) {
  return targetUserId => async dispatch => {
    const loggedUserId = await dispatch(checkAuth({ allowLogin: true }));
    const transactionID = `${actionName}-${nextTransactionID++}`;

    if (methodName === SOCIAL_ACTIONS.FOLLOW) {
      const isAllowed = await dispatch(
        getIsAllowedFollowUser(
          targetUserId,
          blockActionFactory(SOCIAL_ACTIONS.UNBLOCK, UNBLOCK_USER)
        )
      );

      if (!isAllowed) {
        throw new DeclineError('Declined');
      }
    }

    const data = {
      pinner: loggedUserId,
      pinning: targetUserId,
    };

    return dispatch(callSocialContract(methodName, actionName, data, transactionID));
  };
}

export const blockUser = blockActionFactory(SOCIAL_ACTIONS.BLOCK, BLOCK_USER);
export const unblockUser = blockActionFactory(SOCIAL_ACTIONS.UNBLOCK, UNBLOCK_USER);

export const pin = pinActionFactory(SOCIAL_ACTIONS.FOLLOW, PIN);
export const unpin = pinActionFactory(SOCIAL_ACTIONS.UNFOLLOW, UNPIN);
