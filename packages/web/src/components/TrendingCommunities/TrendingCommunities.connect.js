import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_TRENDING_COMMUNITIES } from 'shared/feature-flags';
import { statusSelector, entityArraySelector } from 'store/selectors/common';
import { fetchCommunitiesIfEmpty } from 'store/actions/complex';
import { joinCommunity } from 'store/actions/commun';

import TrendingCommunities from './TrendingCommunities';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_TRENDING_COMMUNITIES }),
  connect(
    state => {
      const { order } = statusSelector('communities')(state);

      return {
        items: entityArraySelector('communities', order)(state),
      };
    },
    {
      fetchCommunitiesIfEmpty,
      joinCommunity,
    }
  )
)(TrendingCommunities);
