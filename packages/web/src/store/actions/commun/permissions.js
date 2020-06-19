import { checkAuth } from 'store/actions/complex';
import {
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_ERROR,
  FETCH_ACCOUNT_SUCCESS,
} from 'store/constants/actionTypes';
import { CYBERWAY_RPC } from 'store/middlewares/commun-api';

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
