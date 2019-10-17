import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { userInputGateLogin } from 'store/actions/gate/auth';

import Login from './Login';

export default connect(
  null,
  {
    userInputGateLogin,
    openModal,
  }
)(Login);
