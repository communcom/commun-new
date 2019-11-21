import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LOGIN, SHOW_MODAL_SIGNUP } from 'store/constants';

import Owned from './Owned';

export default connect(
  null,
  {
    openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
    openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
  }
)(Owned);
