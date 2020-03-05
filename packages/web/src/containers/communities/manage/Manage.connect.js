import { connect } from 'react-redux';

import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { fetchLeaderCommunities } from 'store/actions/gate';

import Manage from './Manage';

export default connect(
  state => {
    const communitiesStatus = statusSelector('leaderCommunities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    fetchLeaderCommunities,
  }
)(Manage);
