import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_LOGIN } from 'store/constants';

import OnboardingWelcome from './OnboardingWelcome';

export default connect(null, {
  openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
})(OnboardingWelcome);
