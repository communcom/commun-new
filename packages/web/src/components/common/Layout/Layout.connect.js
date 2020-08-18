import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { closeOnboardingBanner } from 'store/actions/ui';
import { SHOW_MODAL_ONBOARDING_APP_BANNER } from 'store/constants';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { onboardingSelector, screenTypeDown, screenTypeUp } from 'store/selectors/ui';

import Layout from './Layout';

export default connect(
  state => ({
    isMobile: screenTypeDown.mobileLandscape(state),
    isDesktop: screenTypeUp.desktop(state),
    loggedUserId: currentUnsafeUserIdSelector(state),
    isOnboardingBannerClosed: onboardingSelector('isOnboardingBannerClosed')(state),
  }),
  {
    openAppBannerModal: () => openModal(SHOW_MODAL_ONBOARDING_APP_BANNER),
    closeOnboardingBanner,
  }
)(Layout);
