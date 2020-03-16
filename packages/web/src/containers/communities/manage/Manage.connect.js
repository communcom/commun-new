import { connect } from 'react-redux';

import { entityArraySelector, statusWidgetSelector } from 'store/selectors/common';
import { fetchLeaderCommunities } from 'store/actions/gate';

import Manage from './Manage';

export default connect(
  state => {
    const communitiesStatus = statusWidgetSelector('leaderCommunities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    fetchLeaderCommunities,
  }
)(Manage);
