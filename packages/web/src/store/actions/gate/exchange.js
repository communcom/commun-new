import { defaults } from 'utils/common';
import {
  FETCH_EXCHANGE_CURRENCIES,
  FETCH_EXCHANGE_CURRENCIES_ERROR,
  FETCH_EXCHANGE_CURRENCIES_FULL,
  FETCH_EXCHANGE_CURRENCIES_FULL_ERROR,
  FETCH_EXCHANGE_CURRENCIES_FULL_SUCCESS,
  FETCH_EXCHANGE_CURRENCIES_SUCCESS,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

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

export const getOrCreateClient = ({ email }) => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());

  const params = {
    emailAddress: email,
    publicKey: userId,
  };

  return dispatch({
    [CALL_GATE]: {
      method: 'exchange.getOrCreateClient',
      params,
    },
    meta: params,
  });
};

export const getRates = ({ fiatBaseCurrency, fiatChargeAmount }) => async dispatch => {
  const params = defaults(
    {
      fiatBaseCurrency,
      fiatChargeAmount: String(fiatChargeAmount),
    },
    {
      fiatBaseCurrency: 'usd',
      fiatChargeAmount: '500',
    }
  );

  return dispatch({
    [CALL_GATE]: {
      method: 'exchange.getRates',
      params,
    },
    meta: params,
  });
};

export const addCard = ({
  cardNumber,
  expiry,
  cvc,
  billingPremise,
  billingPostal,
  contactId,
  rememberMe,
  fiatBaseCurrency,
}) => {
  const params = {
    cardNumber,
    expiry,
    cvc,
    billingPremise,
    billingPostal,
    contactId,
    rememberMe,
    fiatBaseCurrency,
  };

  return {
    [CALL_GATE]: {
      method: 'exchange.addCard',
      params,
    },
    meta: params,
  };
};

export const chargeCard = ({
  creditDebitId,
  fiatChargeAmount,
  cryptocurrencySymbol,
  receiveAddress,
  confirmationUrl,
  successRedirectUrl,
  errorRedirectUrl,
  verificationRedirectUrl,
  contactId,
  bypassCardVerification,
}) => {
  const params = {
    creditDebitId,
    fiatChargeAmount,
    cryptocurrencySymbol,
    receiveAddress,
    confirmationUrl,
    successRedirectUrl,
    errorRedirectUrl,
    verificationRedirectUrl,
    contactId,
    bypassCardVerification,
  };

  return {
    [CALL_GATE]: {
      method: 'exchange.chargeCard',
      params,
    },
    meta: params,
  };
};

export const getCarbonStatus = ({ orderId, contactId }) => {
  const params = {
    orderId,
    contactId,
  };

  return {
    [CALL_GATE]: {
      method: 'exchange.getCarbonStatus',
      params,
    },
    meta: params,
  };
};

// PayMir
export const payMirCalculate = ({ amount, type = 'sell' }) => {
  const params = {
    amount,
    type,
  };

  return {
    [CALL_GATE]: {
      method: 'exchange.payMirCalculate',
      params,
    },
    meta: {
      ...params,
      abortPrevious: true,
    },
  };
};

export const payMirSellCMN = ({ txId }) => dispatch => {
  const params = {
    txId,
  };

  return dispatch({
    [CALL_GATE]: {
      method: 'exchange.payMirSellCMN',
      params,
    },
    meta: params,
  });
};

export const payMirBuyCMN = ({ amount }) => dispatch => {
  const params = {
    amount,
  };

  return dispatch({
    [CALL_GATE]: {
      method: 'exchange.payMirBuyCMN',
      params,
    },
    meta: params,
  });
};

export const payMirGetHistory = ({ limit, offset }) => (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());

  const params = {
    userId,
    limit,
    offset,
  };

  return dispatch({
    [CALL_GATE]: {
      method: 'exchange.payMirGetHistory',
      params,
    },
    meta: params,
  });
};
