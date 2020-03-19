import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import {
  modeSelector,
  myCommunitiesSelector,
  statusWidgetSelector,
  entityArraySelector,
} from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { fetchMyCommunitiesIfEmpty, fetchLeaderCommunitiesIfEmpty } from 'store/actions/complex';
import {
  openModalEditor,
  openOnboardingRegistration,
  openOnboardingWelcome,
} from 'store/actions/modals';

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
