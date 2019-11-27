import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
} from 'store/constants';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { CALL_GATE } from 'store/middlewares/gate-api';

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
    // eslint-disable-next-line
    console.warn(err);
  }
};

export const getTransfersHistory = ({ filter = 'all', offset = 0 } = {}) => async (
  dispatch,
  getState
) => {
  const userId = currentUnsafeUserIdSelector(getState());
  const params = {
    userId,
    offset,
    limit: 20,
  };

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [
          FETCH_TRANSFERS_HISTORY,
          FETCH_TRANSFERS_HISTORY_SUCCESS,
          FETCH_TRANSFERS_HISTORY_ERROR,
        ],
        method: 'wallet.getTransferHistory',
        params,
      },
      meta: {
        ...params,
        filter,
      },
    });
  } catch (err) {
    // eslint-disable-next-line
    console.warn(err);
  }
};

export const waitForWalletTransaction = transactionId => {
  if (!transactionId) {
    throw new Error('transactionId is required!');
  }

  const params = {
    transactionId,
  };

  return {
    [CALL_GATE]: {
      //  TODO: replace with wallet.waitForTransaction in future
      method: 'content.waitForTransaction',
      params,
    },
    meta: params,
  };
};

export const waitTransactionAndCheckBalance = transactionId => async dispatch => {
  try {
    await dispatch(waitForWalletTransaction(transactionId));
    await dispatch(getBalance());
  } catch (err) {
    // eslint-disable-next-line
    console.warn(err);
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
