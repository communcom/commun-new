import { connect } from 'react-redux';

import { dataSelector, entityArraySelector, statusSelector } from 'store/selectors/common';

import { leaveCommunity } from 'store/actions/commun';
import { getCommunities, fetchCommunity, waitForTransaction } from 'store/actions/gate';
import { fetchOnboardingCommunitySubscriptions } from 'store/actions/gate/registration';

import Communities from './Communities';

export default connect(
  state => {
    const communitiesStatus = statusSelector('communities')(state);

    return {
      refId: dataSelector(['auth', 'refId'])(state),
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    getCommunities,
    leaveCommunity,
    fetchCommunity,
    waitForTransaction,
    fetchOnboardingCommunitySubscriptions,
  }
)(Communities);
