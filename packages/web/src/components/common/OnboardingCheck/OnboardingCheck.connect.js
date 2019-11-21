import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_WELCOME } from 'store/constants';

import OnboardingCheck from './OnboardingCheck';

export default connect(
  null,
  {
    openOnboarding: () => openModal(SHOW_MODAL_ONBOARDING_WELCOME),
  }
)(OnboardingCheck);
