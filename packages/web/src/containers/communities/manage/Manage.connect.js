import { connect } from 'react-redux';

import { isOwnerSelector } from 'store/selectors/user';
import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { fetchLeaderCommunities } from 'store/actions/gate';

import Manage from './Manage';

export default connect(
  (state, props) => {
    const isOwner = isOwnerSelector(props.userId)(state);
    const communitiesStatus = statusSelector('leaderCommunities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isOwner,
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    fetchLeaderCommunities,
  }
)(Manage);
