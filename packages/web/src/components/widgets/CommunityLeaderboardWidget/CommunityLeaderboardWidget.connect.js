import { connect } from 'react-redux';

import { fetchLeaderCommunities } from 'store/actions/gate';
import { entityArraySelector, entitySelector, statusWidgetSelector } from 'store/selectors/common';

import CommunityLeaderboardWidget from './CommunityLeaderboardWidget';

export default connect(
  (state, props) => {
    const { order, isLoading, isEnd } = statusWidgetSelector('leaderCommunities')(state);
    const communities = entityArraySelector('communities', order)(state);
    const community = entitySelector('communities', props.communityId)(state);

    return {
      community,
      communities,
      isLoading,
      isEnd,
      isAllowLoadMore: !isLoading && !isEnd,
    };
  },
  {
    fetchLeaderCommunities,
  }
)(CommunityLeaderboardWidget);
