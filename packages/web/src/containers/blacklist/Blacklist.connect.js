import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { modeSelector } from 'store/selectors/common';

import Blacklist from './Blacklist';

export default connect(
  createSelector([currentUnsafeUserIdSelector, modeSelector], (userId, mode) => ({
    userId,
    isMobile: mode.screenType === 'mobile' || mode.screenType === 'mobileLandscape',
    isDesktop: mode.screenType === 'desktop',
  }))
)(Blacklist);
