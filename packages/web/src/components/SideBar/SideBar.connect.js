import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { modeSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [currentUnsafeUserSelector, currentUnsafeUserEntitySelector, modeSelector],
    (currentUser, user, mode) => ({
      loggedUserId: currentUser?.userId,
      username: user?.username,
      isDesktop: mode.screenType === 'desktop',
    })
  )
)(SideBar);
