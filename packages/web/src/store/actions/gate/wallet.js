import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
} from 'store/constants';
import { resetTransfersHistoryStatus, resetBalanceStatus } from 'store/actions/wallet';
import { CALL_GATE } from 'store/middlewares/gate-api';

let balanceTimerId;
let transfersTimerId;

/* Из-за лоадера при загрузке вкладки в кошельке по факту постоянно маунтятся и анмаунтятся.
  При этом нужно получение свежих данных, поэтому просто проверка на наличие данных в сторе не подходит.
  По этой причине добавлены статусы полученных трансферов и баланса, которые скидываются через 5 секунд после обновления,
  что потенциально позволяет опять загрузить свежие данные при следующих загрузках компонента
*/

export const getBalance = userId => async dispatch => {
  if (!userId) {
    throw new Error('Username is required!');
  }

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
  } finally {
    if (balanceTimerId) {
      clearTimeout(balanceTimerId);
    }

    balanceTimerId = setTimeout(() => {
      dispatch(resetBalanceStatus());
    }, 5000);
  }
};

export const getTransfersHistory = ({
  username,
  filter = 'all',
  offset = 0,
} = {}) => async dispatch => {
  if (!username) {
    throw new Error('Username is required!');
  }

  const params = {
    userId: username,
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
