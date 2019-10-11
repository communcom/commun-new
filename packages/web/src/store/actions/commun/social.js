import { openModal } from 'redux-modals-manager';

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
import { MODAL_CANCEL, SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const META_FIELDS_MATCH = {
  avatarUrl: 'avatar_url',
  coverUrl: 'cover_url',
  biography: 'biography',
  facebook: 'facebook',
  telegram: 'telegram',
  whatsApp: 'whatsapp',
  weChat: 'wechat',
};

export const updateProfileMeta = updates => async (dispatch, getState) => {
  const state = getState();
  const userId = currentUserIdSelector(state);

  if (!userId) {
    throw new Error('Unauthorized');
  }

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

export const pinActionFactory = (methodName, actionName) => communityId => async (
  dispatch,
  getState
) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    const result = await dispatch(openModal(SHOW_MODAL_LOGIN));
    if (result.status === MODAL_CANCEL) {
      throw new Error('Unauthorized');
    }
  }

  const data = {
    pinner: loggedUserId,
    pinning: communityId,
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

const createBlockAction = (methodName, actionName) => userId => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    const result = await dispatch(openModal(SHOW_MODAL_LOGIN));
    if (result.status === MODAL_CANCEL) {
      throw new Error('Unauthorized');
    }
  }

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
