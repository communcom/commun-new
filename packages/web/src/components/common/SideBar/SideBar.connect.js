import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import {
  modeSelector,
  myCommunitiesSelector,
  statusWidgetSelector,
  entityArraySelector,
} from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { openModalEditor } from 'store/actions/modals';
import { fetchMyCommunitiesIfEmpty, fetchLeaderCommunitiesIfEmpty } from 'store/actions/complex';

import SideBar from './SideBar';

export default connect(
  createSelector(
    [
      currentUnsafeUserSelector,
      currentUnsafeUserEntitySelector,
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
      selectFeatureFlags,
    ],
    (currentUser, user, mode, myCommunities, { manageOrder, manageCommunities }, featureFlags) => ({
      currentUser,
      user,
      isMobile: mode.screenType === 'mobile' || mode.screenType === 'mobileLandscape',
      isDesktop: mode.screenType === 'desktop',
      manageCommunities,
      myCommunities: myCommunities.filter(({ communityId }) => !manageOrder.includes(communityId)),
      featureFlags,
    })
  ),
  {
    fetchMyCommunitiesIfEmpty,
    fetchLeaderCommunitiesIfEmpty,
    openModalEditor,
  }
)(SideBar);
