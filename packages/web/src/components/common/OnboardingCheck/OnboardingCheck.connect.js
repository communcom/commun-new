import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_REGISTRATION, SHOW_MODAL_ONBOARDING_WELCOME } from 'store/constants';
import { isAuthorizedSelector } from 'store/selectors/auth';

import OnboardingCheck from './OnboardingCheck';

export default connect(
  state => ({
    isAuthorized: isAuthorizedSelector(state),
  }),
  {
    openOnboardingWelcome: () => openModal(SHOW_MODAL_ONBOARDING_WELCOME),
    openOnboardingRegistration: () => openModal(SHOW_MODAL_ONBOARDING_REGISTRATION),
  }
)(OnboardingCheck);
