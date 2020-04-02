import { COMMUN_SYMBOL, TOKEN_DECS, PONT_DECS } from 'shared/constants';
import { i18n } from 'shared/i18n';

export function validateAmount(amount, point, checkSupply = false, type) {
  const amountValue = parseFloat(amount);
  const decs = point.symbol === COMMUN_SYMBOL ? TOKEN_DECS : PONT_DECS;
  const availableBalance = point.frozen ? point.balance - point.frozen : point.balance;
  const holdStr = point.frozen
    ? `(+${i18n.t('validations.amount.on_hold', {
        quantity: Number(point.frozen),
      })})`
    : '';

  let error;

  const match = amount.match(/\.(\d+)/);

  switch (true) {
    case match && match[1].length > decs:
      error = i18n.t('validations.amount.more_than_decs', { decs });
      break;
    case !/^\d*(?:\.\d*)?$/.test(amount):
      error = i18n.t('validations.amount.invalid_format');
      break;
    case amountValue && amountValue > availableBalance && type !== 'BUY':
      error = i18n.t('validations.amount.insufficient_funds', {
        availableBalance: parseFloat(availableBalance).toFixed(decs),
        pointName: point.name,
        holdStr,
      });
      break;
    case amount === '' || amountValue === 0:
      error = i18n.t('validations.amount.enter_amount');
      break;
    case checkSupply && amount >= point.supply:
      error = i18n.t('validations.amount.more_than_supply', { supply: point.supply });
      break;
    default:
  }

  return error;
}

export function validateAmountToken(amount, minAmount, maxAmount) {
  const amountValue = parseFloat(amount);

  let error;

  switch (true) {
    case !/^-?\d*(?:\.\d*)?$/.test(amount):
      error = i18n.t('validations.amount.invalid_format');
      break;
    case amount === '' || amountValue === 0:
      error = i18n.t('validations.amount.enter_amount');
      break;
    case minAmount && amount < minAmount:
      error = i18n.t('validations.amount.less_than_minimal', { minAmount });
      break;
    case amount < 0:
      error = i18n.t('validations.amount_token.less_than_0');
      break;
    case maxAmount && amount > maxAmount:
      error = i18n.t('validations.amount.more_than_max', { maxAmount });
      break;
    default:
  }

  return error;
}

export function validateAmountCarbon(amount, minAmount, maxAmount) {
  const amountValue = parseFloat(amount);
  const match = amount.match(/\.(\d+)/);
  const decs = 2;

  let error;

  switch (true) {
    case match && match[1].length > decs:
      error = i18n.t('validations.amount.more_than_decs', { decs });
      break;
    case !/^\d*(?:\.\d*)?$/.test(amount):
      error = i18n.t('validations.amount.invalid_format');
      break;
    case amount === '' || amountValue === 0:
      error = i18n.t('validations.amount.enter_amount');
      break;
    case minAmount && amount < minAmount:
      error = i18n.t('validations.amount.less_than_minimal', { minAmount });
      break;
    case amount < 0:
      error = i18n.t('validations.amount_token.less_than_0');
      break;
    case maxAmount && amount > maxAmount:
      error = i18n.t('validations.amount.more_than_max', { maxAmount });
      break;
    default:
  }

  return error;
}

export function sanitizeAmount(amount) {
  return amount.replace(/,/g, '.').replace(/[^\d.]+/g, '');
}

export function notEmpty(value) {
  return !value;
}

// backend validation from https://github.com/communcom/registration-service/blob/master/src/utils/validation.js
export function validateUsername(value) {
  if (!value) {
    return i18n.t('validations.username.is_empty');
  }

  if (!/^[a-z0-9.-]+$/.test(value)) {
    return i18n.t('validations.username.invalid_symbols');
  }

  if (!/^[a-z]/.test(value)) {
    return i18n.t('validations.username.start_with');
  }

  if (value.length < 3) {
    return i18n.t('validations.username.too_short');
  }

  if (value.length > 32) {
    return i18n.t('validations.username.too_long');
  }

  if (/\.\./.test(value)) {
    return i18n.t('validations.username.several_dots');
  }

  if (/--/.test(value)) {
    return i18n.t('validations.username.several_dashes');
  }

  if (/\.-|-\./.test(value)) {
    return i18n.t('validations.username.invalid_sequences');
  }

  if (!/[a-z0-9]$/.test(value)) {
    return i18n.t('validations.username.ends_with');
  }

  return null;
}

export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validatePassword(password) {
  const isLowerCase = /[a-z]/.test(password);
  const isUpperCase = /[A-Z]/.test(password);
  const isNumber = /\d/.test(password);
  const isMinLength = password.length >= 8;

  return { isLowerCase, isUpperCase, isNumber, isMinLength };
}

export function normalizePassword(password) {
  return password.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|></[\]\\'~`_+;=-]+/g, '');
}
