import { connect } from 'react-redux';

import { claimAirdrop } from 'store/actions/complex/registration';
import { userInputGateLogin } from 'store/actions/gate/auth';
import { openModal } from 'store/actions/modals';
import { uiSelector } from 'store/selectors/common';

import Login from './Login';

export default connect(
  state => ({
    screenType: uiSelector(['mode', 'screenType'])(state),
  }),
  {
    userInputGateLogin,
    claimAirdrop,
    openModal,
  }
)(Login);
