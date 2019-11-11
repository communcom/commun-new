import { connect } from 'react-redux';

import { createFastEqualSelector, statusSelector } from 'store/selectors/common';
import { fetchPosts } from 'store/actions/gate';
import { defaultHomeFeedSelector } from 'store/selectors/auth';

import FeedFiltersPanel from './FeedFiltersPanel';

export default connect(
  createFastEqualSelector(
    [statusSelector('feed'), defaultHomeFeedSelector],
    (feedStatus, defaultFeed) => {
      const { type, timeframe } = feedStatus.filter;
      return {
        type,
        timeframe,
        defaultFeed,
      };
    }
  ),
  {
    fetchPosts,
  }
)(FeedFiltersPanel);
