import { connect } from 'react-redux';

import { statusSelector, entityArraySelector } from 'store/selectors/common';
import { fetchCommunitiesIfEmpty } from 'store/actions/complex';
import { joinCommunity } from 'store/actions/commun';

import TrendingCommunities from './TrendingCommunities';

export default connect(
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
)(TrendingCommunities);
