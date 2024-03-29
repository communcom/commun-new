import { connect } from 'react-redux';

import { joinCommunity, leaveCommunity } from 'store/actions/commun';
import {
  clearOnboardingCommunities,
  fetchCommunity,
  getBalance,
  getCommunities,
  waitForTransaction,
} from 'store/actions/gate';
import { fetchOnboardingCommunitySubscriptions } from 'store/actions/gate/registration';
import { unauthClearCommunities, unauthRemoveCommunity } from 'store/actions/local';
import { openModal, openSignUpModal } from 'store/actions/modals';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, entityArraySelector, statusSelector } from 'store/selectors/common';

import Communities from './Communities';

export default connect(
  state => {
    const communitiesStatus = statusSelector('communities')(state);
    const communities = entityArraySelector('communities', communitiesStatus.order)(state);
    const pendingCommunities = dataSelector(['unauth', 'communities'])(state);
    const selectedItemsIds = communitiesStatus.onboardingSubscriptions;
    const selectedItems = entityArraySelector('communities', selectedItemsIds || [])(state);

    return {
      isAuthorized: isAuthorizedSelector(state),
      refId: dataSelector(['auth', 'refId'])(state),
      items: communities,
      selectedItems,
      selectedItemsIds,
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
