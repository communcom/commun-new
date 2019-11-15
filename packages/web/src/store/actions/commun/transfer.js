import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  TRANSFER_TOKEN,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_ERROR,
  TRANSFER_POINT,
  TRANSFER_POINT_SUCCESS,
  TRANSFER_POINT_ERROR,
} from 'store/constants/actionTypes';

import { checkAuth } from 'store/actions/complex';

import {
  POINT_CONVERT_TYPE,
  COMMUN_SYMBOL,
  TOKEN_DECS,
  PONT_DECS,
  POINT_CONTRACT_ACCOUNT,
} from 'shared/constants';

const formatQuantity = (amount, symbol) =>
  `${parseFloat(amount).toFixed(symbol === COMMUN_SYMBOL ? TOKEN_DECS : PONT_DECS)} ${symbol}`;

const getTransferAction = (symbol, data) => {
  const types =
    symbol === COMMUN_SYMBOL
      ? [TRANSFER_TOKEN, TRANSFER_TOKEN_SUCCESS, TRANSFER_TOKEN_ERROR]
      : [TRANSFER_POINT, TRANSFER_POINT_SUCCESS, TRANSFER_POINT_ERROR];

  const contract = symbol === COMMUN_SYMBOL ? 'cyberToken' : 'point';

  return {
    [COMMUN_API]: {
      types,
      contract,
      method: 'transfer',
      params: data,
    },
    meta: data,
  };
};

export const transfer = (recipient, amount, symbol, memo = '') => async dispatch => {
  const userId = await dispatch(checkAuth());

  const data = {
    from: userId,
    to: recipient,
    quantity: formatQuantity(amount, symbol),
    memo,
  };

  return dispatch(getTransferAction(symbol, data));
};

export const convert = (convertType, amount, symbol) => async dispatch => {
  const memo = convertType === POINT_CONVERT_TYPE.BUY ? symbol : formatQuantity(amount, symbol);
  const symb = convertType === POINT_CONVERT_TYPE.BUY ? COMMUN_SYMBOL : symbol;

  return dispatch(transfer(POINT_CONTRACT_ACCOUNT, amount, symb, memo));
};
