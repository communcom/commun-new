import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_REGISTRATION } from 'store/constants';
import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';

import OnboardingCheck from './OnboardingCheck';

export default connect(
  state => ({
    isAuthorized: isUnsafeAuthorizedSelector(state),
  }),
  {
    openOnboardingRegistration: () => openModal(SHOW_MODAL_ONBOARDING_REGISTRATION),
  }
)(OnboardingCheck);
