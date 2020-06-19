import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { compose } from 'redux';

import { FEED_COMMUNITY_TYPES, TIMEFRAME_DAY } from 'shared/constants';
import { fetchPosts } from 'store/actions/gate';

import FeedCommunityFiltersPanel from './FeedCommunityFiltersPanel';

export default compose(
  withRouter,
  connect(
    (state, { router: { query } }) => {
      const type = query.subSection || FEED_COMMUNITY_TYPES[0].type;
      const timeframe = query.subSubSection || TIMEFRAME_DAY;
      const feedFilter = FEED_COMMUNITY_TYPES.find(value => value.type === type);

      return {
        feedFilter,
        type,
        timeframe,
      };
    },
    {
      fetchPosts,
    }
  )
)(FeedCommunityFiltersPanel);
