import { connect } from 'react-redux';

import { leaveCommunity } from 'store/actions/commun';
import { fetchCommunity, getCommunities, waitForTransaction } from 'store/actions/gate';
import { entityArraySelector, statusSelector } from 'store/selectors/common';

import Communities from './Communities';

export default connect(
  state => {
    const communitiesStatus = statusSelector('communities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    getCommunities,
    leaveCommunity,
    fetchCommunity,
    waitForTransaction,
  }
)(Communities);
