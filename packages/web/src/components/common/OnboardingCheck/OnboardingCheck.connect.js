import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_REGISTRATION, SHOW_MODAL_SIGNUP } from 'store/constants';
import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import OnboardingCheck from './OnboardingCheck';

export default connect(
  state => ({
    isAuthorized: isUnsafeAuthorizedSelector(state),
    isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
  }),
  {
    openOnboardingRegistration: () => openModal(SHOW_MODAL_ONBOARDING_REGISTRATION),
    openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
  }
)(OnboardingCheck);
