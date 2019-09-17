import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  CREATE_WALLET,
  CREATE_WALLET_SUCCESS,
  CREATE_WALLET_ERROR,
  WITHDRAW,
  STOP_WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  STOP_WITHDRAW_SUCCESS,
  STOP_WITHDRAW_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'vesting';

export const openWallet = vestingId => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

  const data = {
    owner: loggedUserId,
    symbol: vestingId,
    ram_payer: loggedUserId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [CREATE_WALLET, CREATE_WALLET_SUCCESS, CREATE_WALLET_ERROR],
      contract: CONTRACT_NAME,
      method: 'open',
      params: data,
    },
    meta: data,
  });
};

export const withdrawTokens = (tokensQuantity, tokensType) => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

  const data = {
    from: loggedUserId,
    to: loggedUserId,
    quantity: `${tokensQuantity} ${tokensType}`,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [WITHDRAW, WITHDRAW_SUCCESS, WITHDRAW_ERROR],
      contract: CONTRACT_NAME,
      method: 'withdraw',
      params: data,
    },
    meta: data,
  });
};

export const stopWithdrawTokens = communityId => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

  const data = {
    owner: loggedUserId,
    symbol: communityId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [STOP_WITHDRAW, STOP_WITHDRAW_SUCCESS, STOP_WITHDRAW_ERROR],
      contract: CONTRACT_NAME,
      method: 'stopwithdraw',
      params: data,
    },
    meta: data,
  });
};
