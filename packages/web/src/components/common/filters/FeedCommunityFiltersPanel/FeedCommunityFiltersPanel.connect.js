import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { FEED_COMMUNITY_TYPES } from 'shared/constants';
import { statusSelector } from 'store/selectors/common';
import { fetchPosts } from 'store/actions/gate';

import FeedCommunityFiltersPanel from './FeedCommunityFiltersPanel';

export default compose(
  withRouter,
  connect(
    (state, { router: { query } }) => {
      const { timeframe } = statusSelector('feed')(state).filter;
      const type = query.subSection || FEED_COMMUNITY_TYPES[0].type;
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
