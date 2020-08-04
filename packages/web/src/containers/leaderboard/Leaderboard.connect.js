import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { clearCommunityFilter } from 'store/actions/ui';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { entityArraySelector, statusWidgetSelector } from 'store/selectors/common';

import Leaderboard from './Leaderboard';

export default connect(
  createSelector(
    [
      isAuthorizedSelector,
      state => {
        const { order, isLoaded: isManageCommunitiesLoaded } = statusWidgetSelector(
          'managementCommunities'
        )(state);
        const manageCommunities = entityArraySelector('communities', order)(state) || [];

        return { manageCommunities, isManageCommunitiesLoaded };
      },
    ],
    (isAuthorized, { manageCommunities, isManageCommunitiesLoaded }) => ({
      isAuthorized,
      isManageCommunitiesLoaded,
      canManage: Boolean(manageCommunities.length),
    })
  ),
  {
    clearCommunityFilter,
  }
)(Leaderboard);
