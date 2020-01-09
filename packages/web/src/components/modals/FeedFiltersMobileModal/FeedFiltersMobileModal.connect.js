import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { FEED_TYPES } from 'shared/constants';
import { statusSelector } from 'store/selectors/common';
import { fetchPosts } from 'store/actions/gate';
import { defaultHomeFeedSelector } from 'store/selectors/auth';

import FeedFiltersMobileModal from './FeedFiltersMobileModal';

export default compose(
  withRouter,
  connect(
    (state, { router: { query } }) => {
      const { timeframe } = statusSelector('feed')(state).filter;
      const feedType = query.feedType || defaultHomeFeedSelector(state);
      const feedFilters = FEED_TYPES[feedType];
      const type = query.feedSubType || feedFilters[0].type;

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
)(FeedFiltersMobileModal);
