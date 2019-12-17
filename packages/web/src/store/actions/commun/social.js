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
import { getIsAllowedFollowUser } from 'store/actions/complex';
import { DeclineError } from 'utils/errors';

let nextTransactionID = 0;

const META_FIELDS_MATCH = {
  avatarUrl: 'avatar_url',
  coverUrl: 'cover_url',
  biography: 'biography',
  facebook: 'facebook',
  telegram: 'telegram',
  whatsApp: 'whatsapp',
  weChat: 'wechat',
};

const FOLLOW_USER = 'pin';
const UNFOLLOW_USER = 'unpin';

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

const callSocialContract = (methodName, actionName, data, transactionID) => async dispatch => {
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

const blockActionFactory = (methodName, actionName) => userId => async dispatch => {
  const loggedUserId = await dispatch(checkAuth(true));
  const transactionID = `${actionName}-${nextTransactionID++}`;

  const data = {
    blocker: loggedUserId,
    blocking: userId,
  };

  return dispatch(callSocialContract(methodName, actionName, data, transactionID));
};

export const blockUser = blockActionFactory('block', BLOCK_USER);
export const unblockUser = blockActionFactory('unblock', UNBLOCK_USER);

export const pinActionFactory = (methodName, actionName) => targetUserId => async dispatch => {
  const loggedUserId = await dispatch(checkAuth(true));
  const transactionID = `${actionName}-${nextTransactionID++}`;

  if (methodName === FOLLOW_USER) {
    const isAllowed = await dispatch(getIsAllowedFollowUser(targetUserId, unblockUser));

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

export const pin = pinActionFactory(FOLLOW_USER, PIN);
export const unpin = pinActionFactory(UNFOLLOW_USER, UNPIN);
