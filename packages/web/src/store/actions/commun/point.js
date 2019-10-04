import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  OPEN_WALLET,
  OPEN_WALLET_SUCCESS,
  OPEN_WALLET_ERROR,
  CLOSE_WALLET,
  CLOSE_WALLET_SUCCESS,
  CLOSE_WALLET_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'point';

export const openWallet = communityId => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

  const data = {
    owner: loggedUserId,
    symbol: communityId,
    ram_payer: loggedUserId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [OPEN_WALLET, OPEN_WALLET_SUCCESS, OPEN_WALLET_ERROR],
      contract: CONTRACT_NAME,
      method: 'open',
      params: data,
    },
    meta: data,
  });
};

export const closeWallet = (communityId, balance) => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

  if (balance > 0) {
    throw new Error('Cannot close because the balance is not zero');
  }

  const data = {
    owner: loggedUserId,
    symbol: communityId,
    ram_payer: loggedUserId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [CLOSE_WALLET, CLOSE_WALLET_SUCCESS, CLOSE_WALLET_ERROR],
      contract: CONTRACT_NAME,
      method: 'close',
      params: data,
    },
    meta: data,
  });
};
