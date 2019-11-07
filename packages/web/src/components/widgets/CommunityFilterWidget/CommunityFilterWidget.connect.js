import { connect } from 'react-redux';

import { statusWidgetSelector, entityArraySelector, uiSelector } from 'store/selectors/common';
import { fetchLeaderCommunities } from 'store/actions/gate';
import { selectCommunity, clearCommunityFilter, loadSelectedCommunities } from 'store/actions/ui';

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
