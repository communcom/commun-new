import { connect } from 'react-redux';

import { logout } from 'store/actions/gate';
import { openModal, openModalExchangeCommun } from 'store/actions/modals';
import { SHOW_MODAL_LOGIN, SHOW_MODAL_SIGNUP } from 'store/constants';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { dataSelector, modeSelector, statusSelector } from 'store/selectors/common';
import { currencySelector } from 'store/selectors/settings';
import { totalBalanceSelector } from 'store/selectors/wallet';

import AuthBlock from './AuthBlock';

export default connect(
  state => ({
    refId: dataSelector(['auth', 'refId'])(state),
    currentUser: currentUnsafeUserSelector(state),
    balance: totalBalanceSelector(state),
    currency: currencySelector(state),
    isBalanceUpdated: statusSelector('wallet')(state).isBalanceUpdated,
    isDesktop: modeSelector(state).screenType === 'desktop',
  }),
  {
    logout,
    openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
    openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
    openModalExchangeCommun,
  }
)(AuthBlock);
