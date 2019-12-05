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

export const pinActionFactory = (methodName, actionName) => targetUserId => async dispatch => {
  const loggedUserId = await dispatch(checkAuth(true));
  const transactionID = `${actionName}-${nextTransactionID++}`;

  const data = {
    pinner: loggedUserId,
    pinning: targetUserId,
  };

  let result;

  // optimistic
  dispatch({
    type: actionName,
    meta: data,
    optimist: { type: BEGIN, id: transactionID },
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

export const pin = pinActionFactory('pin', PIN);
export const unpin = pinActionFactory('unpin', UNPIN);

const createBlockAction = (methodName, actionName) => userId => async dispatch => {
  const loggedUserId = await dispatch(checkAuth(true));

  const data = {
    blocker: loggedUserId,
    blocking: userId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: 'social',
      addSystemActor: 'c.social',
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const blockUser = createBlockAction('block', BLOCK_USER);
export const unblockUser = createBlockAction('unblock', UNBLOCK_USER);
