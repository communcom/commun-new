// eslint-disable-next-line import/prefer-default-export
export function parsePoints(amount, balance) {
  const amountValue = parseFloat(amount);

  let error;

  const match = amount.match(/\.(\d+)/);

  switch (true) {
    case match && match[1].length > 3:
      error = 'No more than 3 decimal places';
      break;
    case !/^\d*(?:\.\d*)?$/.test(amount):
      error = 'Invalid format';
      break;
    case amountValue && amountValue > balance:
      error = 'Insufficient funds';
      break;
    case amount === '' || amountValue === 0:
      error = 'Enter amount';
      break;
    default:
  }

  return {
    error,
    value: error ? null : amountValue,
  };
}

export function notEmpty(value) {
  return !value;
}

// TODO
export function validateAccountName(name) {
  return notEmpty(name);
}
