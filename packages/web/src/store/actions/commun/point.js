import { normalizeCyberwayErrorMessage } from 'utils/errors';
import { checkAuth } from 'store/actions/complex/auth';
import {
  CLOSE_WALLET,
  CLOSE_WALLET_ERROR,
  CLOSE_WALLET_SUCCESS,
  OPEN_WALLET,
  OPEN_WALLET_ERROR,
  OPEN_WALLET_SUCCESS,
} from 'store/constants/actionTypes';
import { COMMUN_API } from 'store/middlewares/commun-api';

const CONTRACT_NAME = 'point';

export const openWallet = communityId => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  const data = {
    owner: loggedUserId,
    commun_code: communityId,
    ram_payer: loggedUserId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [OPEN_WALLET, OPEN_WALLET_SUCCESS, OPEN_WALLET_ERROR],
      contract: CONTRACT_NAME,
      method: 'open',
      params: data,
    },
    meta: {
      owner: loggedUserId,
    },
  });
};

export const closeWallet = (communityId, balance) => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

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

export const handleNoBalance = (communityId, action) => async dispatch => {
  try {
    return await dispatch(action);
  } catch (originalError) {
    const error = normalizeCyberwayErrorMessage(originalError);

    // Если мы получаем такую ошибку, значит не открыт баланс,
    // пробуем открыть и снова пытаемся провести транзакцию.
    if (error === 'balance does not exist') {
      await dispatch(openWallet(communityId));

      return dispatch(action);
    }

    throw originalError;
  }
};
