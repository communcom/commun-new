import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { modeSelector, myCommunitiesSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { fetchMyCommunitiesIfEmpty } from 'store/actions/complex';
import { openEditor } from 'store/actions/ui';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [
      currentUnsafeUserSelector,
      currentUnsafeUserEntitySelector,
      modeSelector,
      myCommunitiesSelector,
      selectFeatureFlags,
    ],
    (currentUser, user, mode, myCommunities, featureFlags) => ({
      currentUser,
      user,
      isMobile: mode.screenType === 'mobile' || mode.screenType === 'mobileLandscape',
      isDesktop: mode.screenType === 'desktop',
      myCommunities,
      featureFlags,
    })
  ),
  {
    fetchMyCommunitiesIfEmpty,
    openEditor,
  }
)(SideBar);
