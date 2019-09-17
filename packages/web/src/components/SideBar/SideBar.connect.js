import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { modeSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate/auth';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [currentUnsafeUserSelector, modeSelector],
    (currentUser, mode) => ({
      loggedUserId: currentUser?.userId,
      isUnsafeAuthorized: currentUser?.unsafe || false,
      isDesktop: mode.screenType === 'desktop',
    })
  ),
  {
    logout,
    openModal,
  }
)(SideBar);
