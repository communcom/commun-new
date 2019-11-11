import { connect } from 'react-redux';

import {
  createFastEqualSelector,
  defaultHomeFeedSelector,
  statusSelector,
} from 'store/selectors/common';
import { fetchPosts } from 'store/actions/gate';

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
