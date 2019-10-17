import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_SIGNUP, SHOW_MODAL_LOGIN } from 'store/constants';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate';

import AuthBlock from './AuthBlock';

export default connect(
  state => ({
    currentUser: currentUnsafeUserSelector(state),
    user: currentUnsafeUserEntitySelector(state),
  }),
  {
    logout,
    openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
    openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
  }
)(AuthBlock);
