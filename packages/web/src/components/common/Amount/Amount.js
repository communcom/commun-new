import PropTypes from 'prop-types';

import { formatMoney } from 'utils/format';

// TODO: get from backend
const COMMUN_PER_USD = 0.015;

export default function Amount({ value, currency }) {
  let totalValue = Number(value);

  if (currency === 'USD') {
    totalValue *= COMMUN_PER_USD;
  }

  return formatMoney(totalValue, currency);
}

Amount.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currency: PropTypes.string.isRequired,
};
