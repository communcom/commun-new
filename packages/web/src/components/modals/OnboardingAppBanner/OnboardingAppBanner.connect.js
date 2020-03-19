import { connect } from 'react-redux';

import { SHOW_MODAL_LOGIN } from 'store/constants';
import { openModal } from 'store/actions/modals';

import OnboardingAppBanner from './OnboardingAppBanner';

export default connect(null, {
  openSignInModal: () => openModal(SHOW_MODAL_LOGIN),
})(OnboardingAppBanner);
