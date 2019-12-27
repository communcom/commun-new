import { COMMUN_SYMBOL, TOKEN_DECS, PONT_DECS } from 'shared/constants';

export function validateAmount(amount, point, checkSupply = false) {
  const amountValue = parseFloat(amount);
  const decs = point.symbol === COMMUN_SYMBOL ? TOKEN_DECS : PONT_DECS;
  const availableBalance = point.frozen ? point.balance - point.frozen : point.balance;
  const holdStr = point.frozen ? `(+${point.frozen} on hold)` : '';

  let error;

  const match = amount.match(/\.(\d+)/);

  switch (true) {
    case match && match[1].length > decs:
      error = `No more than ${decs} decimal places`;
      break;
    case !/^\d*(?:\.\d*)?$/.test(amount):
      error = 'Invalid format';
      break;
    case amountValue && amountValue > availableBalance:
      error = `Insufficient funds: ${parseFloat(availableBalance).toFixed(decs)} ${
        point.name
      } ${holdStr}`;
      break;
    case amount === '' || amountValue === 0:
      error = 'Enter amount';
      break;
    case checkSupply && amount >= point.supply:
      error = `Amount is more than supply: ${point.supply}`;
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
      error = 'Invalid format';
      break;
    case amount === '' || amountValue === 0:
      error = 'Enter amount';
      break;
    case minAmount && amount < minAmount:
      error = `Amount is less than minimal: ${minAmount}`;
      break;
    case amount < 0:
      error = 'Amount is less than 0';
      break;
    case maxAmount && amount > maxAmount:
      error = `Amount is more than ${maxAmount}`;
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
