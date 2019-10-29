import { connect } from 'react-redux';

import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { getCommunities } from 'store/actions/gate';

import Discover from './Discover';

export default connect(
  state => {
    const communitiesStatus = statusSelector('communities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  { getCommunities }
)(Discover);
