import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { FEED_TYPES, TIMEFRAME_DAY } from 'shared/constants';
import { fetchPosts } from 'store/actions/gate';
import { defaultHomeFeedSelector } from 'store/selectors/auth';

import FeedFiltersPanel from './FeedFiltersPanel';

export default compose(
  withRouter,
  connect(
    (state, { router: { query } }) => {
      const feedType = query.feedType || defaultHomeFeedSelector(state);
      const feedFilters = FEED_TYPES[feedType];
      const type = query.feedSubType || feedFilters[0].type;
      const timeframe = query.feedSubSubType || TIMEFRAME_DAY;

      return {
        timeframe,
        feedType,
        feedFilters,
        type,
      };
    },
    {
      fetchPosts,
    }
  )
)(FeedFiltersPanel);
