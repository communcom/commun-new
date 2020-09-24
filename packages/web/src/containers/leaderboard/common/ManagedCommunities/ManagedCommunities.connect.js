import { connect } from 'react-redux';

import { fetchLeaderCommunities } from 'store/actions/gate';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, entityArraySelector, statusWidgetSelector } from 'store/selectors/common';

import ManagedCommunities from './ManagedCommunities';

export default connect(
  state => {
    const communitiesStatus = statusWidgetSelector('leaderCommunities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
      isAuthorized: isAuthorizedSelector(state),
      isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
    };
  },
  {
    fetchLeaderCommunities,
  }
)(ManagedCommunities);
