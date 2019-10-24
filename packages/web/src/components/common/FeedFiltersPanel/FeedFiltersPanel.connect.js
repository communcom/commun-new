import { connect } from 'react-redux';

import { createFastEqualSelector, statusSelector } from 'store/selectors/common';
import { fetchPosts } from 'store/actions/gate';

import FeedFiltersPanel from './FeedFiltersPanel';

export default connect(
  createFastEqualSelector([statusSelector('feed')], feedStatus => {
    const { type, timeframe } = feedStatus.filter;
    return {
      type,
      timeframe,
    };
  }),
  {
    fetchPosts,
  }
)(FeedFiltersPanel);
