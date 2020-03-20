import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { statusSelector, modeSelector, isWebViewSelector } from 'store/selectors/common';
import { retinaSuffixSelector } from 'store/selectors/ui';
import { pdfDataSelector, regDataSelector } from 'store/selectors/registration';
import { blockChainStopLoader } from 'store/actions/gate/registration';
import { registrationUser } from 'store/actions/complex';
import { clearRegErrors } from 'store/actions/local/registration';

import MasterKey from './MasterKey';

export default connect(
  state => {
    const { isLoadingBlockChain, blockChainError } = statusSelector('registration')(state);
    const regData = regDataSelector(state);
    const retinaSuffix = retinaSuffixSelector(state);
    const user = currentUnsafeUserSelector(state);
    const mode = modeSelector(state);
    const isWebView = isWebViewSelector(state);
    const pdfData = pdfDataSelector(state);

    return {
      user,
      masterPassword: regData?.keys?.master,
      isLoadingBlockChain,
      blockChainError,
      retinaSuffix,
      wishPassword: regData.wishPassword,
      pdfData,
      isMobile: mode.screenType === 'mobile' || isWebView,
    };
  },
  {
    registrationUser,
    blockChainStopLoader,
    clearRegErrors,
  }
)(MasterKey);
