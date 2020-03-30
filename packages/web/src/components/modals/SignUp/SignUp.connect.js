import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { uiSelector } from 'store/selectors/common';
import { openModal, openConfirmDialog } from 'store/actions/modals';
import { setScreenId, setLocalStorageData } from 'store/actions/local/registration';

import SignUp from './SignUp';

export default connect(
  state => ({
    featureToggles: selectFeatureFlags(state),
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
