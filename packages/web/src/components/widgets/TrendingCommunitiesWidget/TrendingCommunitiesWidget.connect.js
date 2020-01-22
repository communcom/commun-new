import { connect } from 'react-redux';

import { statusWidgetSelector, entityArraySelector } from 'store/selectors/common';
import { joinCommunity } from 'store/actions/commun';
import { getTrendingCommunitiesIfEmpty } from 'store/actions/complex';

import TrendingCommunitiesWidget from './TrendingCommunitiesWidget';

export default connect(
  state => {
    const { order, isLoading, isEnd, forceSubscribed } = statusWidgetSelector(
      'trendingCommunities'
    )(state);

    return {
      items: entityArraySelector('communities', order)(state),
      isLoading,
      isEnd,
      forceSubscribed,
    };
  },
  {
    joinCommunity,
    getTrendingCommunitiesIfEmpty,
  }
)(TrendingCommunitiesWidget);
