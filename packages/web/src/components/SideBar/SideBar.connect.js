import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { modeSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate/auth';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [currentUnsafeUserSelector, currentUnsafeUserEntitySelector, modeSelector],
    (currentUser, user, mode) => ({
      loggedUserId: currentUser?.userId,
      isUnsafeAuthorized: currentUser?.unsafe || false,
      username: user?.username,
      isDesktop: mode.screenType === 'desktop',
    })
  ),
  {
    logout,
    openModal,
  }
)(SideBar);
