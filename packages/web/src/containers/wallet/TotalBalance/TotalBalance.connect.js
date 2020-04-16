import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currencySelector } from 'store/selectors/settings';
import { modeSelector } from 'store/selectors/common';
import { totalBalanceSelector } from 'store/selectors/wallet';
import { updateSettings } from 'store/actions/gate';
import { openModal } from 'store/actions/modals';

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
