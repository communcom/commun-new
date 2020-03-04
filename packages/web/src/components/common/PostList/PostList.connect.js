import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_APP_BANNER } from 'store/constants';
import { fetchPosts } from 'store/actions/gate';
import { statusSelector, modeSelector, dataSelector } from 'store/selectors/common';
import { screenTypeDown, onboardingBannerSelector } from 'store/selectors/ui';
import { currentUserIdSelector } from 'store/selectors/auth';

import PostList from './PostList';

export default connect(
  createSelector(
    [
      statusSelector('feed'),
      modeSelector,
      screenTypeDown.mobileLandscape,
      currentUserIdSelector,
      dataSelector(['auth', 'isAutoLogging']),
      onboardingBannerSelector('isOnboardingBannerClosed'),
    ],
    (feedStatus, mode, isMobile, loggedUserId, isAutoLogging, isOnboardingBannerClosed) => ({
      fetchError: feedStatus.error,
      order: feedStatus.order,
      nextOffset: feedStatus.nextOffset,
      isLoading: feedStatus.isLoading,
      isAllowLoadMore: !feedStatus.isLoading && !feedStatus.isEnd,
      isOneColumnMode: mode.isOneColumnMode,
      isMobile,
      loggedUserId,
      isAutoLogging,
      isOnboardingBannerClosed,
    })
  ),
  {
    fetchPosts,
    openAppBannerModal: () => openModal(SHOW_MODAL_ONBOARDING_APP_BANNER),
  }
)(PostList);
