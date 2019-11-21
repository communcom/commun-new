import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, modeSelector } from 'store/selectors/common';

import Wallet from './Wallet';

export default connect(
  createSelector(
    [isAuthorizedSelector, dataSelector(['auth', 'isAutoLogging']), modeSelector],
    (isAuthorized, isAutoLogging, mode) => ({
      isAuthorized,
      isAutoLogging,
      isMobile: mode.screenType === 'mobile',
    })
  )
)(Wallet);
