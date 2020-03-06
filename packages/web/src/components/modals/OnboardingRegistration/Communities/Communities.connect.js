import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, entityArraySelector, statusSelector } from 'store/selectors/common';

import { joinCommunity, leaveCommunity } from 'store/actions/commun';
import { getCommunities, fetchCommunity, waitForTransaction, getBalance } from 'store/actions/gate';
import { openSignUpModal } from 'store/actions/modals';
import { fetchOnboardingCommunitySubscriptions } from 'store/actions/gate/registration';
import { unauthClearCommunities, unauthRemoveCommunity } from 'store/actions/local';

import Communities from './Communities';

export default connect(
  (state, props) => {
    const communitiesStatus = statusSelector('communities')(state);
    const communities = entityArraySelector('communities', communitiesStatus.order)(state);
    const pendingCommunities = dataSelector(['unauth', 'communities'])(state);

    if (props.isSignUp) {
      communities.map(community => {
        if (pendingCommunities.includes(community.communityId)) {
          return {
            ...community,
            isSubscribed: true,
          };
        }

        return community;
      });
    }

    return {
      isAuthorized: isAuthorizedSelector(state),
      refId: dataSelector(['auth', 'refId'])(state),
      items: communities,
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
  }
)(Communities);
