import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { dataSelector, uiSelector } from 'store/selectors/common';
import { userInputGateLogin } from 'store/actions/gate/auth';

import Login from './Login';

export default connect(
  state => ({
    refId: dataSelector(['auth', 'refId'])(state),
    screenType: uiSelector(['mode', 'screenType'])(state),
  }),
  {
    userInputGateLogin,
    openModal,
  }
)(Login);
