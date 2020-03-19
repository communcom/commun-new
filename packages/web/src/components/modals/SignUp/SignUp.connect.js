import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';
import { setScreenId, setLocalStorageData } from 'store/actions/registration';
import { openModal, openConfirmDialog } from 'store/actions/modals';

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
