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

// backend validation from https://github.com/communcom/registration-service/blob/develop/src/utils/validation.js
export function validateUsername(value) {
  let suffix = 'Username should ';

  if (!value) {
    return `${suffix}not be empty`;
  }

  if (value.length < 5) {
    return `${suffix}be longer`;
  }

  if (value.length > 32) {
    return `${suffix}be shorter`;
  }

  if (/\./.test(value)) {
    suffix = 'Each username segment should ';
  }

  const segments = value.split('.');

  for (const segment of segments) {
    if (!/^[a-z]/.test(segment)) {
      return `${suffix}start with a letter`;
    }

    if (!/^[a-z0-9-]*$/.test(segment)) {
      return `${suffix}have only letters, digits, or dashes`;
    }

    if (/--/.test(segment)) {
      return `${suffix}have only one dash in a row`;
    }

    if (!/[a-z0-9]$/.test(segment)) {
      return `${suffix}end with a letter or digit`;
    }

    if (!(segment.length >= 5)) {
      return `${suffix}be longer`;
    }
  }

  return null;
}
