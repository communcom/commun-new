import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { modeSelector } from 'store/selectors/common';
import { userCommunPointSelector } from 'store/selectors/wallet';

import TotalBalance from './TotalBalance';

export default connect(
  createSelector(
    [userCommunPointSelector, modeSelector],
    (comunPoint, mode) => ({
      totalBalance: comunPoint?.balance || '0',
      isMobile: mode.screenType === 'mobile',
    })
  ),
  {
    openModal,
  }
)(TotalBalance);
