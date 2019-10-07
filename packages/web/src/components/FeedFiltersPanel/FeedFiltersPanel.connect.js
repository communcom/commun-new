import { connect } from 'react-redux';

import { createFastEqualSelector, statusSelector } from 'store/selectors/common';
import { fetchPosts } from 'store/actions/gate';

import FeedFiltersPanel from './FeedFiltersPanel';

export default connect(
  createFastEqualSelector([statusSelector('feed')], feedStatus => {
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
