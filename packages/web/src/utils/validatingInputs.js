// eslint-disable-next-line import/prefer-default-export
export function parsePoints(amount, balance) {
  const amountValue = parseFloat(amount);

  let error;

  const match = amount.match(/\.(\d+)/);

  switch (true) {
    case match && match[1].length > 3:
      error = 'Не более 3-х знаков после запятой';
      break;
    case !/^\d*(?:\.\d*)?$/.test(amount):
      error = 'Неправильный формат';
      break;
    case amountValue && amountValue > balance:
      error = 'Недостаточно средств';
      break;
    case amount === '' || amountValue === 0:
      error = 'Введите сумму';
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
