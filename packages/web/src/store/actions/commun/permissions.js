import commun from 'commun-client';

import { checkAuth } from 'store/actions/complex';
import { logout } from 'store/actions/gate';
import { UPDATE_AUTH, UPDATE_AUTH_ERROR, UPDATE_AUTH_SUCCESS } from 'store/constants';
import {
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_ERROR,
  FETCH_ACCOUNT_SUCCESS,
} from 'store/constants/actionTypes';
import { COMMUN_API, CYBERWAY_RPC } from 'store/middlewares/commun-api';

const PARENT_PERMISSION = {
  active: 'owner',
  owner: '',
};

// eslint-disable-next-line import/prefer-default-export
export const fetchAccountPermissions = () => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  return dispatch({
    [CYBERWAY_RPC]: {
      types: [FETCH_ACCOUNT, FETCH_ACCOUNT_SUCCESS, FETCH_ACCOUNT_ERROR],
      method: 'get_account',
      params: loggedUserId,
      meta: { accountName: loggedUserId },
    },
  });
};

export const changePassword = ({
  ownerKey,
  publicKeys,
  availableRoles,
  delaySec,
}) => async dispatch => {
  const userId = await dispatch(checkAuth());

  const actions = availableRoles.map(role => ({
    contractAccount: 'cyber',
    actionName: 'updateauth',
    auth: { actor: userId, permission: 'owner' },
    data: {
      account: userId,
      permission: role,
      parent: PARENT_PERMISSION[role],
      auth: {
        threshold: 1,
        keys: [
          {
            weight: 1,
            key: publicKeys[role],
          },
        ],
        accounts: [],
        waits: [],
      },
    },
  }));

  commun.initProvider(ownerKey);

  const results = await dispatch({
    [COMMUN_API]: {
      types: [UPDATE_AUTH, UPDATE_AUTH_SUCCESS, UPDATE_AUTH_ERROR],
      contract: 'basic',
      method: 'executeActions',
      params: actions,
      options: {
        delaySec,
      },
    },
  });

  if (!delaySec) {
    dispatch(logout());
  }

  return results;
};
