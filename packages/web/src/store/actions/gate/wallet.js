import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
} from 'store/constants';
import { TRANSFERS_FILTER_TYPE } from 'shared/constants';
import { resetTransfersHistoryStatus, resetBalanceStatus } from 'store/actions/wallet';
import { CALL_GATE } from 'store/middlewares/gate-api';

let balanceTimerId;
let transfersTimerId;

/* Из-за лоадера при загрузке вкладки в кошельке по факту постоянно маунтятся и анмаунтятся. При этом нужно получение свежих данных, поэтому просто проверка на наличие данных в сторе не подходит. По этой причине добавлены статусы полученных трансферов и баланса, которые скидываются через 5 секунд после обновления, что потенциально позволяет опять загрузить свежие данные при следующих загрузках компонента */

export const getBalance = username => async dispatch => {
  if (!username) {
    throw new Error('Username is required!');
  }

  const params = {
    name: username,
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
        needAuth: true,
      },
    });
  } catch (err) {
    // eslint-disable-next-line
    console.warn(err);
  } finally {
    if (balanceTimerId) {
      clearTimeout(balanceTimerId);
    }

    balanceTimerId = setTimeout(() => {
      dispatch(resetBalanceStatus());
    }, 5000);
  }
};

export const getTransfersHistory = (username, { isIncoming }) => async dispatch => {
  if (!username) {
    throw new Error('Username is required!');
  }

  const params = {
    query: {
      [isIncoming ? TRANSFERS_FILTER_TYPE.RECEIVER : TRANSFERS_FILTER_TYPE.SENDER]: username,
    },
  };

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [
          FETCH_TRANSFERS_HISTORY,
          FETCH_TRANSFERS_HISTORY_SUCCESS,
          FETCH_TRANSFERS_HISTORY_ERROR,
        ],
        method: 'wallet.getHistory',
        params,
      },
      meta: {
        ...params,
        needAuth: true,
      },
    });
  } catch (err) {
    // eslint-disable-next-line
    console.warn(err);
  } finally {
    if (transfersTimerId) {
      clearTimeout(transfersTimerId);
    }

    transfersTimerId = setTimeout(() => {
      dispatch(resetTransfersHistoryStatus());
    }, 5000);
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
