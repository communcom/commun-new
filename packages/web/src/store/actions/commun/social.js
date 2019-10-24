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

  const data = {
    pinner: loggedUserId,
    pinning: targetUserId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: 'social',
      method: methodName,
      params: data,
    },
    meta: data,
  });
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
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const blockUser = createBlockAction('block', BLOCK_USER);
export const unblockUser = createBlockAction('unblock', UNBLOCK_USER);
