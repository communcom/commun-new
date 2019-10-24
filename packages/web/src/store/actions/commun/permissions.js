import commun from 'commun-client';

import { COMMUN_API, CYBERWAY_RPC } from 'store/middlewares/commun-api';

import {
  UPDATE_AUTH,
  UPDATE_AUTH_SUCCESS,
  UPDATE_AUTH_ERROR,
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_ERROR,
} from 'store/constants/actionTypes';
import { checkAuth } from 'store/actions/complex';

const PARENT_PERMISSION = {
  active: 'owner',
  owner: '',
};

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

export const changePassword = (ownerKey, publicKeys) => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  const updateAuthActions = ['active', 'owner'].map(auth =>
    commun.basic.prepareAction(
      'cyber',
      'updateauth',
      { accountName: loggedUserId, permission: 'owner' },
      {
        account: loggedUserId,
        permission: auth,
        parent: PARENT_PERMISSION[auth],
        auth: {
          threshold: 1,
          keys: [
            {
              weight: 1,
              key: publicKeys[auth],
            },
          ],
          accounts: [],
          waits: [],
        },
      }
    )
  );

  commun.initProvider(ownerKey);

  dispatch({
    [COMMUN_API]: {
      types: [UPDATE_AUTH, UPDATE_AUTH_SUCCESS, UPDATE_AUTH_ERROR],
      contract: 'basic',
      method: 'sendActions',
      params: updateAuthActions,
    },
  });
};
