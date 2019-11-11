import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { uiSelector } from 'store/selectors/common';
import { userInputGateLogin } from 'store/actions/gate/auth';

import Login from './Login';

export default connect(
  state => ({
    screenType: uiSelector(['mode', 'screenType'])(state),
  }),
  {
    userInputGateLogin,
    openModal,
  }
)(Login);
