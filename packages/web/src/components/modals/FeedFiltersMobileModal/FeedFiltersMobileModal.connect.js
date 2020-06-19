import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { compose } from 'redux';

import { FEED_TYPES_MOBILE, TIMEFRAME_DAY } from 'shared/constants';
import { fetchPosts } from 'store/actions/gate';
import { defaultHomeFeedSelector } from 'store/selectors/auth';

import FeedFiltersMobileModal from './FeedFiltersMobileModal';

export default compose(
  withRouter,
  connect(
    (state, { router: { query } }) => {
      const feedType = query.feedType || defaultHomeFeedSelector(state);
      const feedFilters = FEED_TYPES_MOBILE[feedType];
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
)(FeedFiltersMobileModal);
