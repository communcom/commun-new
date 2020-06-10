import { connect } from 'react-redux';

import { openLoginModal, openSignUpModal } from 'store/actions/modals';

import MobileSlides from './MobileSlides';

export default connect(null, {
  openSignUpModal,
  openLoginModal,
})(MobileSlides);
