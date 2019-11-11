import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { uiSelector } from 'store/selectors/common';
import { setScreenId, setLocalStorageData } from 'store/actions/registration';
import { openConfirmDialog } from 'store/actions/modals/confirm';

import SignUp from './SignUp';

export default connect(
  state => ({
    screenId: state.data.registration.screenId,
    screenType: uiSelector(['mode', 'screenType'])(state),
  }),
  {
    setScreenId,
    openModal,
    setLocalStorageData,
    openConfirmDialog,
  }
)(SignUp);
