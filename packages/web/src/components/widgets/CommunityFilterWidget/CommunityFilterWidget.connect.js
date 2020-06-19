import { connect } from 'react-redux';

import { fetchLeaderCommunities } from 'store/actions/gate';
import { clearCommunityFilter, loadSelectedCommunities, selectCommunity } from 'store/actions/ui';
import { entityArraySelector, statusWidgetSelector, uiSelector } from 'store/selectors/common';

import CommunityFilterWidget from './CommunityFilterWidget';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusWidgetSelector('leaderCommunities')(state);
    const items = entityArraySelector('communities', order)(state);
    const { selectedCommunities, isLoaded } = uiSelector('leaderBoard')(state);

    return {
      items,
      isLoading,
      isEnd,
      selectedCommunities,
      isSelectedCommunitiesLoaded: isLoaded,
    };
  },
  {
    fetchLeaderCommunities,
    selectCommunity,
    clearCommunityFilter,
    loadSelectedCommunities,
  }
)(CommunityFilterWidget);
