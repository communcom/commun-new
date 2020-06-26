import { connect } from 'react-redux';

import { userInputGateLogin } from 'store/actions/gate/auth';
import { openModal } from 'store/actions/modals';
import { currentUserIdSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';

import Password from './Password';

export default connect(
  state => ({
    currentUserId: currentUserIdSelector(state),
    screenType: uiSelector(['mode', 'screenType'])(state),
  }),
  {
    userInputGateLogin,
    openModal,
  }
)(Password);
