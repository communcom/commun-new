import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';
import { userInputGateLogin } from 'store/actions/gate/auth';
import { claimAirdrop } from 'store/actions/complex/registration';
import { openModal } from 'store/actions/modals';

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
