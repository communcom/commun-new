import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LOGIN } from 'store/constants';

import MobileSlides from './MobileSlides';

export default connect(null, {
  openSignInModal: () => openModal(SHOW_MODAL_LOGIN),
})(MobileSlides);
