import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, entityArraySelector, statusSelector } from 'store/selectors/common';

import { joinCommunity, leaveCommunity } from 'store/actions/commun';
import {
  getCommunities,
  fetchCommunity,
  waitForTransaction,
  getBalance,
  clearOnboardingCommunities,
} from 'store/actions/gate';
import { openSignUpModal } from 'store/actions/modals';
import { fetchOnboardingCommunitySubscriptions } from 'store/actions/gate/registration';
import { unauthClearCommunities, unauthRemoveCommunity } from 'store/actions/local';

import Communities from './Communities';

export default connect(
  state => {
    const communitiesStatus = statusSelector('communities')(state);
    const communities = entityArraySelector('communities', communitiesStatus.order)(state);
    const pendingCommunities = dataSelector(['unauth', 'communities'])(state);

    return {
      isAuthorized: isAuthorizedSelector(state),
      refId: dataSelector(['auth', 'refId'])(state),
      items: communities,
      selectedItems: entityArraySelector(
        'communities',
        communitiesStatus.onboardingSubscriptions || []
      )(state),
      pendingCommunities,
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    getBalance,
    openModal,
    openSignUpModal,
    getCommunities,
    unauthClearCommunities,
    unauthRemoveCommunity,
    joinCommunity,
    leaveCommunity,
    fetchCommunity,
    waitForTransaction,
    fetchOnboardingCommunitySubscriptions,
    clearOnboardingCommunities,
  }
)(Communities);
