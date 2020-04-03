import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { SHOW_MODAL_ONBOARDING_APP_BANNER } from 'store/constants';
// import { openModal } from 'store/actions/modals';
import { fetchPosts } from 'store/actions/gate';
import {
  entitiesSelector,
  statusSelector,
  modeSelector,
  // dataSelector,
} from 'store/selectors/common';
import {
  screenTypeDown,
  // onboardingSelector
} from 'store/selectors/ui';
import { currentUserIdSelector } from 'store/selectors/auth';

import PostList from './PostList';

export default connect(
  createSelector(
    [
      statusSelector('feed'),
      modeSelector,
      screenTypeDown.mobileLandscape,
      currentUserIdSelector,
      // dataSelector(['auth', 'isAutoLogging']),
      // onboardingSelector('isOnboardingBannerClosed'),
      entitiesSelector('rewards'),
    ],
    (
      feedStatus,
      mode,
      isMobile,
      loggedUserId,
      // isAutoLogging,
      // isOnboardingBannerClosed,
      rewards
    ) => {
      const rewardsArr = [];
      let firstUserPostId = null;

      for (const reward of Object.keys(rewards)) {
        if (rewards[reward].topCount > 1) {
          rewardsArr.push(reward);
        }
      }

      if (loggedUserId && feedStatus.order.length) {
        firstUserPostId = feedStatus.order.find(item => item.includes(loggedUserId));
      }

      return {
        fetchError: feedStatus.error,
        order: feedStatus.order,
        nextOffset: feedStatus.nextOffset,
        isLoading: feedStatus.isLoading,
        isAllowLoadMore: !feedStatus.isLoading && !feedStatus.isEnd,
        isOneColumnMode: mode.isOneColumnMode,
        isMobile,
        loggedUserId,
        // isAutoLogging,
        // isOnboardingBannerClosed,
        rewardsArr,
        firstUserPostId,
      };
    }
  ),
  {
    fetchPosts,
    // openAppBannerModal: () => openModal(SHOW_MODAL_ONBOARDING_APP_BANNER),
  }
)(PostList);
