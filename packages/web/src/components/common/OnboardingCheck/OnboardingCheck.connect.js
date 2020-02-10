import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_REGISTRATION, SHOW_MODAL_ONBOARDING_WELCOME } from 'store/constants';
import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';
import { screenTypeUp } from 'store/selectors/ui';

import OnboardingCheck from './OnboardingCheck';

export default connect(
  state => ({
    isAuthorized: isUnsafeAuthorizedSelector(state),
    isMobile: !screenTypeUp.tablet(state),
    hasModals: state.modals.length > 0,
  }),
  {
    openRegistrationOnboarding: () => openModal(SHOW_MODAL_ONBOARDING_REGISTRATION),
    openWelcomeOnboarding: params => openModal(SHOW_MODAL_ONBOARDING_WELCOME, params),
  }
)(OnboardingCheck);
