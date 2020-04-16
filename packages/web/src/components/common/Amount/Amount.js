import React from 'react';
import PropTypes from 'prop-types';

import { formatMoney } from 'utils/format';

// TODO: get from backend
const COMMUN_PER_USE = 0.015;

export default function Amount({ value, currency }) {
  let totalValue = Number(value);

  if (currency === 'USD') {
    totalValue *= COMMUN_PER_USE;
  }

  return <div>{formatMoney(totalValue, currency)}</div>;
}

Amount.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currency: PropTypes.string.isRequired,
};
