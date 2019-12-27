import { CALL_GATE } from 'store/middlewares/gate-api';

import {
  FETCH_EXCHANGE_CURRENCIES,
  FETCH_EXCHANGE_CURRENCIES_SUCCESS,
  FETCH_EXCHANGE_CURRENCIES_ERROR,
  FETCH_EXCHANGE_CURRENCIES_FULL,
  FETCH_EXCHANGE_CURRENCIES_FULL_SUCCESS,
  FETCH_EXCHANGE_CURRENCIES_FULL_ERROR,
} from 'store/constants';

export const getExchangeCurrencies = () => ({
  [CALL_GATE]: {
    types: [
      FETCH_EXCHANGE_CURRENCIES,
      FETCH_EXCHANGE_CURRENCIES_SUCCESS,
      FETCH_EXCHANGE_CURRENCIES_ERROR,
    ],
    method: 'exchange.getCurrencies',
  },
});

export const getExchangeCurrenciesFull = () => ({
  [CALL_GATE]: {
    types: [
      FETCH_EXCHANGE_CURRENCIES_FULL,
      FETCH_EXCHANGE_CURRENCIES_FULL_SUCCESS,
      FETCH_EXCHANGE_CURRENCIES_FULL_ERROR,
    ],
    method: 'exchange.getCurrenciesFull',
  },
});

export const getMinMaxAmount = ({ from, to }) => ({
  [CALL_GATE]: {
    method: 'exchange.getMinMaxAmount',
    params: {
      from,
      to,
    },
  },
  meta: {
    from,
    to,
  },
});

export const getExchangeAmount = ({ from, to, amount }) => ({
  [CALL_GATE]: {
    method: 'exchange.getExchangeAmount',
    params: {
      from,
      to,
      amount,
    },
  },
  meta: {
    from,
    to,
    amount,
  },
});

export const createTransaction = ({
  from,
  address,
  amount,
  extraId = null,
  refundAddress = null,
  refundExtraId = null,
}) => ({
  [CALL_GATE]: {
    method: 'exchange.createTransaction',
    params: {
      from,
      address,
      amount,
      extraId,
      refundAddress,
      refundExtraId,
    },
  },
  meta: {
    from,
    address,
    amount,
    extraId,
    refundAddress,
    refundExtraId,
  },
});

export const getStatus = ({ id }) => ({
  [CALL_GATE]: {
    method: 'exchange.getStatus',
    params: {
      id,
    },
  },
  meta: {
    id,
  },
});
