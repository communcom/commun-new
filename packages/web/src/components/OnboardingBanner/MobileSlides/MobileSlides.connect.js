import { connect } from 'react-redux';

import { SHOW_MODAL_LOGIN } from 'store/constants';
import { openModal } from 'store/actions/modals';

import MobileSlides from './MobileSlides';

export default connect(null, {
  openSignInModal: () => openModal(SHOW_MODAL_LOGIN),
})(MobileSlides);
