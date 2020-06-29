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
  dataSelector,
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
      dataSelector('config'),
      screenTypeDown.mobileLandscape,
      selectFeatureFlags,
    ],
    (
      currentUser,
      mode,
      myCommunities,
      { manageOrder, manageCommunities },
      { isMaintenance },
      isMobile,
      featureFlags
    ) => ({
      currentUser,
      manageCommunities,
      myCommunities: myCommunities.filter(({ communityId }) => !manageOrder.includes(communityId)),
      isMaintenance,
      isMobile,
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
