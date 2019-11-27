import { COMMUN_SYMBOL, TOKEN_DECS, PONT_DECS } from 'shared/constants';

export function validateAmount(amount, point, checkSupply = false) {
  const amountValue = parseFloat(amount);
  const decs = point.symbol === COMMUN_SYMBOL ? TOKEN_DECS : PONT_DECS;

  let error;

  const match = amount.match(/\.(\d+)/);

  switch (true) {
    case match && match[1].length > decs:
      error = `No more than ${decs} decimal places`;
      break;
    case !/^\d*(?:\.\d*)?$/.test(amount):
      error = 'Invalid format';
      break;
    case amountValue && amountValue > point.balance:
      error = `Insufficient funds: ${point.balance} ${point.name}`;
      break;
    case amount === '' || amountValue === 0:
      error = 'Enter amount';
      break;
    case checkSupply && amount >= point.supply:
      error = "Can't convert more than supply";
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

// TODO
export function validateAccountName(name) {
  return notEmpty(name);
}
