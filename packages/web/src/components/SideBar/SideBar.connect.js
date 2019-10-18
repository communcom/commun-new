import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { modeSelector, myCommunitiesSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { fetchMyCommunitiesIfEmpty } from 'store/actions/complex';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [
      currentUnsafeUserSelector,
      currentUnsafeUserEntitySelector,
      modeSelector,
      myCommunitiesSelector,
    ],
    (currentUser, user, mode, myCommunities) => ({
      currentUser,
      user,
      isDesktop: mode.screenType === 'desktop',
      myCommunities,
    })
  ),
  {
    fetchMyCommunitiesIfEmpty,
  }
)(SideBar);
