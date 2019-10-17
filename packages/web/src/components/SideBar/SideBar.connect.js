import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { modeSelector, dataSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { fetchMyCommunitiesIfNeed } from 'store/actions/gate';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [
      currentUnsafeUserSelector,
      currentUnsafeUserEntitySelector,
      modeSelector,
      dataSelector(['myCommunities', 'items']),
    ],
    (currentUser, user, mode, myCommunities) => ({
      currentUser,
      user,
      isDesktop: mode.screenType === 'desktop',
      myCommunities,
    })
  ),
  {
    fetchMyCommunitiesIfNeed,
  }
)(SideBar);
