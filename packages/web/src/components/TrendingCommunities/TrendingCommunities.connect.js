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
        id: 'photographers',
        name: 'photographers',
        followersQuantity: 342,
      },
      {
        id: 'overwatch',
        name: 'overwatch',
        followersQuantity: 12943,
      },
      {
        id: 'adme',
        name: 'adme',
        followersQuantity: 501475,
      },
      {
        id: 'dribble',
        name: 'dribble',
        followersQuantity: 32400,
      },
      {
        id: 'behance',
        name: 'behance',
        followersQuantity: 32400,
      },
    ];

    return {
      trendingCommunities,
    };
  })
)(TrendingCommunities);
