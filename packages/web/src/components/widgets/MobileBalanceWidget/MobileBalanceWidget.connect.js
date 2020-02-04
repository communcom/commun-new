import { connect } from 'react-redux';

import { formatNumber } from 'utils/format';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { totalBalanceSelector } from 'store/selectors/wallet';
import { statusSelector } from 'store/selectors/common';

import MobileBalanceWidget from './MobileBalanceWidget';

export default connect(state => {
  const balance = totalBalanceSelector(state) || 0;

  return {
    currentUser: currentUnsafeUserSelector(state),
    balance: formatNumber(parseFloat(balance).toFixed(2)),
    isBalanceUpdated: statusSelector('wallet')(state).isBalanceUpdated,
  };
})(MobileBalanceWidget);
