import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { fetchLeaderCommunitiesIfEmpty, fetchMyCommunitiesIfEmpty } from 'store/actions/complex';
import {
  openModalEditor,
  openOnboardingRegistration,
  openOnboardingWelcome,
} from 'store/actions/modals';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import {
  entityArraySelector,
  modeSelector,
  myCommunitiesSelector,
  statusWidgetSelector,
} from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [
      currentUnsafeUserSelector,
      modeSelector,
      myCommunitiesSelector,
      state => {
        const manageOrder = statusWidgetSelector(['managementCommunities', 'order'])(state);
        const manageCommunities = entityArraySelector('communities', manageOrder)(state);

        return {
          manageOrder,
          manageCommunities,
        };
      },
      screenTypeDown.mobileLandscape,
      selectFeatureFlags,
    ],
    (
      currentUser,
      mode,
      myCommunities,
      { manageOrder, manageCommunities },
      isMobile,
      featureFlags
    ) => ({
      currentUser,
      isMobile,
      manageCommunities,
      myCommunities: myCommunities.filter(({ communityId }) => !manageOrder.includes(communityId)),
      featureFlags,
    })
  ),
  {
    fetchMyCommunitiesIfEmpty,
    fetchLeaderCommunitiesIfEmpty,
    openModalEditor,
    openOnboardingWelcome,
    openOnboardingRegistration,
  }
)(SideBar);
