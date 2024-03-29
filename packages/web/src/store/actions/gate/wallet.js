import { TRANSACTION_HISTORY_TYPE } from 'shared/constants';
import { captureException } from 'utils/errors';
import {
  FETCH_POINT_HISTORY,
  FETCH_POINT_HISTORY_ERROR,
  FETCH_POINT_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_ERROR,
  FETCH_USER_BALANCE_SUCCESS,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

export const waitForWalletTransaction = transactionId => {
  if (!transactionId || typeof transactionId !== 'string') {
    throw new Error('No transaction id');
  }

  const params = {
    transactionId,
  };

  return {
    [CALL_GATE]: {
      method: 'wallet.waitForTransaction',
      params,
    },
    meta: params,
  };
};

export const getBalance = () => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());

  const params = {
    userId,
  };

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_USER_BALANCE, FETCH_USER_BALANCE_SUCCESS, FETCH_USER_BALANCE_ERROR],
        method: 'wallet.getBalance',
        params,
      },
      meta: {
        ...params,
      },
    });
  } catch (err) {
    captureException(err);
  }
};

export const getTransfersHistory = ({
  historyType,
  direction = 'all',
  transferType = 'all',
  rewardsType = 'all',
  claimType = 'all',
  donationsType = 'all',
  holdType = 'all',
  symbol,
  offset = 0,
} = {}) => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());
  const isPointHistory = historyType === TRANSACTION_HISTORY_TYPE.POINT;

  const params = {
    userId,
    direction,
    transferType,
    rewards: rewardsType,
    donation: donationsType,
    claim: claimType,
    holdType,
    symbol: isPointHistory ? symbol : 'all',
    offset: isPointHistory ? 0 : offset,
    limit: 20,
  };

  try {
    await dispatch({
      [CALL_GATE]: {
        types: isPointHistory
          ? [FETCH_POINT_HISTORY, FETCH_POINT_HISTORY_SUCCESS, FETCH_POINT_HISTORY_ERROR]
          : [
              FETCH_TRANSFERS_HISTORY,
              FETCH_TRANSFERS_HISTORY_SUCCESS,
              FETCH_TRANSFERS_HISTORY_ERROR,
            ],
        method: 'wallet.getTransferHistory',
        params,
      },
      meta: {
        ...params,
      },
    });
  } catch (err) {
    captureException(err);
  }
};

export const waitTransactionAndCheckBalance = transactionId => async dispatch => {
  try {
    await dispatch(waitForWalletTransaction(transactionId));
    await dispatch(getBalance());
  } catch (err) {
    captureException(err);
  }
};

export const getSellPrice = quantity => {
  const params = {
    quantity,
  };

  return {
    [CALL_GATE]: {
      method: 'wallet.getSellPrice',
      params,
    },
    meta: params,
  };
};

export const getBuyPrice = (pointSymbol, quantity) => {
  const params = {
    pointSymbol,
    quantity,
  };

  return {
    [CALL_GATE]: {
      method: 'wallet.getBuyPrice',
      params,
    },
    meta: params,
  };
};

export const getPointInfo = symbol => {
  const params = {
    symbol,
  };

  return {
    [CALL_GATE]: {
      method: 'wallet.getPointInfo',
      params,
    },
    meta: params,
  };
};
