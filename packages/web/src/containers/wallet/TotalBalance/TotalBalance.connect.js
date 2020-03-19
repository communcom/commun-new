import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { modeSelector } from 'store/selectors/common';
import { totalBalanceSelector } from 'store/selectors/wallet';
import { openModal } from 'store/actions/modals';

import TotalBalance from './TotalBalance';

export default connect(
  createSelector([totalBalanceSelector, modeSelector], (totalBalance, mode) => ({
    totalBalance,
    isMobile: mode.screenType === 'mobile',
  })),
  {
    openModal,
  }
)(TotalBalance);
