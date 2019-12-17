import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { statusWidgetSelector, entityArraySelector } from 'store/selectors/common';
import { selectCommunity, clearCommunityFilter } from 'store/actions/ui';

import LeaderBoard from './LeaderBoard';

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
    selectCommunity,
    clearCommunityFilter,
  }
)(LeaderBoard);
