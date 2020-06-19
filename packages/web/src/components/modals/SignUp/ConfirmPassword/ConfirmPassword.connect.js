import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { registrationUser } from 'store/actions/complex';
import { clearRegErrors } from 'store/actions/local/registration';
import { isWebViewSelector, modeSelector } from 'store/selectors/common';
import { regDataSelector } from 'store/selectors/registration';

import ConfirmPassword from './ConfirmPassword';

export default connect(
  createSelector(
    [regDataSelector, modeSelector, isWebViewSelector],
    ({ wishPassword }, mode, isWebView) => ({
      wishPassword,
      isMobile: mode.screenType === 'mobile' || isWebView,
    })
  ),
  {
    clearRegErrors,
    registrationUser,
  }
)(ConfirmPassword);
