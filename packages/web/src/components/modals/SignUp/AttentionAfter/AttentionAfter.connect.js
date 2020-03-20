import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_REGISTRATION } from 'store/constants';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { isWebViewSelector, modeSelector } from 'store/selectors/common';
import { pdfDataSelector, regDataSelector } from 'store/selectors/registration';
import { clearRegistrationData } from 'store/actions/local/registration';

import AttentionAfter from './AttentionAfter';

export default connect(
  state => {
    const regData = regDataSelector(state);
    const user = currentUnsafeUserSelector(state);
    const mode = modeSelector(state);
    const isWebView = isWebViewSelector(state);
    const pdfData = pdfDataSelector(state);

    return {
      user,
      wishPassword: regData.wishPassword,
      pdfData,
      isMobile: mode.screenType === 'mobile' || isWebView,
    };
  },
  {
    clearRegistrationData,
    openOnboarding: () => openModal(SHOW_MODAL_ONBOARDING_REGISTRATION),
  }
)(AttentionAfter);
