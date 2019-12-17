import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { modeSelector } from 'store/selectors/common';

import Wallet from './Wallet';

export default connect(
  createSelector(
    [isAuthorizedSelector, modeSelector],
    (isAuthorized, mode) => ({
      isAuthorized,
      isMobile: mode.screenType === 'mobile',
    })
  )
)(Wallet);
