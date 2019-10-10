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
import { normalizeCyberwayErrorMessage } from 'utils/errors';

const CONTRACT_NAME = 'point';

export const openWallet = communityId => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

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

export const handleNoBalance = (communityId, action) => async dispatch => {
  try {
    return await dispatch(action);
  } catch (originalError) {
    const error = normalizeCyberwayErrorMessage(originalError);

    // Если мы получаем такую ошибку, значит не открыт баланс,
    // пробуем открыть и снова пытаемся провести транзакцию.
    if (error === 'balance does not exist') {
      try {
        await dispatch(openWallet(communityId));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Open balance failed:', err);
        throw originalError;
      }

      return dispatch(action);
    }

    throw originalError;
  }
};
