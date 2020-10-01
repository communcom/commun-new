import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { entityArraySelector, statusWidgetSelector } from 'store/selectors/common';
import { screenTypeUp } from 'store/selectors/ui';

import Leaderboard from './Leaderboard';

export default connect(
  createSelector(
    [
      isAuthorizedSelector,
      screenTypeUp.desktop,
      state => {
        const { order, isLoaded: isManageCommunitiesLoaded } = statusWidgetSelector(
          'managementCommunities'
        )(state);
        const manageCommunities = entityArraySelector('communities', order)(state) || [];

        return { manageCommunities, isManageCommunitiesLoaded };
      },
      selectFeatureFlags,
    ],
    (isAuthorized, isDesktop, { manageCommunities, isManageCommunitiesLoaded }, featureFlags) => ({
      isAuthorized,
      isDesktop,
      isManageCommunitiesLoaded,
      canManage: Boolean(manageCommunities.length),
      featureFlags, // just for rerender when featureFlags will restore on client
    })
  )
)(Leaderboard);
