import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { updateSettings } from 'store/actions/gate';
import { openModal } from 'store/actions/modals';
import { modeSelector } from 'store/selectors/common';
import { currencySelector } from 'store/selectors/settings';
import { totalBalanceSelector } from 'store/selectors/wallet';

import TotalBalance from './TotalBalance';

export default connect(
  createSelector(
    [currencySelector, totalBalanceSelector, modeSelector],
    (currency, totalBalance, mode) => ({
      currency,
      totalBalance,
      isMobile: mode.screenType === 'mobile',
    })
  ),
  {
    updateSettings,
    openModal,
  }
)(TotalBalance);
