import { connect } from 'react-redux';

import { SHOW_MODAL_LOGIN } from 'store/constants';
import { openModal } from 'store/actions/modals';

import OnboardingWelcome from './OnboardingWelcome';

export default connect(null, {
  openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
})(OnboardingWelcome);
