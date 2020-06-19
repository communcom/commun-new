import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { setLocalStorageData, setScreenId } from 'store/actions/local/registration';
import { openConfirmDialog, openModal } from 'store/actions/modals';
import { uiSelector } from 'store/selectors/common';

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
