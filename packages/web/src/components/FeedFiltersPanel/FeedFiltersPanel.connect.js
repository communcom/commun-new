import { connect } from 'react-redux';

import { createDeepEqualSelector, statusSelector } from 'store/selectors/common';
import { fetchPosts } from 'store/actions/gate';

import FeedFiltersPanel from './FeedFiltersPanel';

export default connect(
  createDeepEqualSelector([statusSelector('feed')], feedStatus => {
    const { sortBy, timeframe } = feedStatus.filter;
    return {
      sortBy,
      timeframe,
    };
  }),
  {
    fetchPosts,
  }
)(FeedFiltersPanel);
