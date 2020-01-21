import BigNum from 'bignumber.js';

const DEFAULT_TRANSFER_FEE = 0.1;

// eslint-disable-next-line
export function calculateAmount({ amount, decs }) {
  return new BigNum(amount).shiftedBy(-decs).toString();
}

export function calculateFee(point) {
  return point.transferFee ? point.transferFee / 100 : DEFAULT_TRANSFER_FEE;
}
