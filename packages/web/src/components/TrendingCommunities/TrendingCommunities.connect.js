import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_TRENDING_COMMUNITIES } from 'shared/feature-flags';
import TrendingCommunities from './TrendingCommunities';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_TRENDING_COMMUNITIES }),
  connect(() => {
    // TODO: replace width real data
    const trendingCommunities = [
      {
        communityId: 'photographers',
        alias: 'id123',
        name: 'photographers',
        followersQuantity: 342,
      },
      {
        communityId: 'overwatch',
        alias: 'id123',
        name: 'overwatch',
        followersQuantity: 12943,
      },
      {
        communityId: 'adme',
        alias: 'id123',
        name: 'adme',
        followersQuantity: 501475,
      },
      {
        communityId: 'dribble',
        alias: 'id123',
        name: 'dribble',
        followersQuantity: 32400,
      },
      {
        communityId: 'behance',
        alias: 'id123',
        name: 'behance',
        followersQuantity: 32400,
      },
    ];

    return {
      trendingCommunities,
    };
  })
)(TrendingCommunities);
