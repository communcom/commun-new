import { connect } from 'react-redux';

import { formatMoney } from 'utils/format';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { statusSelector } from 'store/selectors/common';
import { totalBalanceSelector } from 'store/selectors/wallet';

import MobileBalanceWidget from './MobileBalanceWidget';

export default connect(state => {
  const balance = totalBalanceSelector(state) || 0;

  return {
    currentUser: currentUnsafeUserSelector(state),
    balance: formatMoney(parseFloat(balance).toFixed(2)),
    isBalanceUpdated: statusSelector('wallet')(state).isBalanceUpdated,
  };
})(MobileBalanceWidget);
