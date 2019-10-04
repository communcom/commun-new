import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  TRANSFER_TOKEN,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_ERROR,
  TRANSFER_POINT,
  TRANSFER_POINT_SUCCESS,
  TRANSFER_POINT_ERROR,
} from 'store/constants/actionTypes';

import { currentUserIdSelector } from 'store/selectors/auth';

import { getBalance, waitForWalletTransaction } from 'store/actions/gate';
import { displayError, displaySuccess } from 'utils/toastsMessages';

const getTransferAction = (symbol, data) => {
  if (symbol === 'COMMUN') {
    return {
      [COMMUN_API]: {
        types: [TRANSFER_TOKEN, TRANSFER_TOKEN_SUCCESS, TRANSFER_TOKEN_ERROR],
        contract: 'cyberToken',
        method: 'transfer',
        params: data,
      },
      meta: data,
    };
  }
  return {
    [COMMUN_API]: {
      types: [TRANSFER_POINT, TRANSFER_POINT_SUCCESS, TRANSFER_POINT_ERROR],
      contract: 'point',
      method: 'transfer',
      params: data,
    },
    meta: data,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const transfer = (recipient, amount, symbol, /* COMMUN = 4 */ decs = 4, memo = '') => async (
  dispatch,
  getState
) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const quantity = `${parseFloat(amount).toFixed(decs)} ${symbol}`;

  const data = {
    from: userId,
    to: recipient,
    quantity,
    memo,
  };

  try {
    const { processed } = await dispatch(getTransferAction(symbol, data));

    if (processed?.id) {
      await dispatch(waitForWalletTransaction(processed.id));
      await dispatch(getBalance(userId));
      displaySuccess('Transfer is successful');
    }
  } catch (err) {
    displayError('Transfer is failed', err);
  }
};
