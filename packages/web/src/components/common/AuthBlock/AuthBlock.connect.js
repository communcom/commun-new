import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_SIGNUP, SHOW_MODAL_LOGIN } from 'store/constants';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { userCommunPointSelector } from 'store/selectors/wallet';
import { modeSelector, statusSelector } from 'store/selectors/common';
import { logout } from 'store/actions/gate';

import AuthBlock from './AuthBlock';

export default connect(
  state => ({
    currentUser: currentUnsafeUserSelector(state),
    balance: Math.round(userCommunPointSelector(state).balance),
    isBalanceUpdated: statusSelector('wallet')(state).isBalanceUpdated,
    isDesktop: modeSelector(state).screenType === 'desktop',
  }),
  {
    logout,
    openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
    openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
  }
)(AuthBlock);
