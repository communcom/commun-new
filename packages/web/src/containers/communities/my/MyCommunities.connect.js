import { connect } from 'react-redux';

import { fetchMyCommunities } from 'store/actions/gate';
import { entityArraySelector, statusSelector } from 'store/selectors/common';

import MyCommunities from './MyCommunities';

export default connect(
  state => {
    const communitiesStatus = statusSelector('myCommunities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    fetchMyCommunities,
  }
)(MyCommunities);
