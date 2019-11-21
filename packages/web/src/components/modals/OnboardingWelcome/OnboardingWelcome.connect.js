import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LOGIN } from 'store/constants';

import OnboardingWelcome from './OnboardingWelcome';

export default connect(
  null,
  {
    openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
  }
)(OnboardingWelcome);
