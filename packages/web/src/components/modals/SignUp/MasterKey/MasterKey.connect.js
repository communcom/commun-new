import { connect } from 'react-redux';

import { registrationUser } from 'store/actions/complex';
import { blockChainStopLoader } from 'store/actions/gate/registration';
import { clearRegErrors } from 'store/actions/local/registration';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { isWebViewSelector, modeSelector, statusSelector } from 'store/selectors/common';
import { pdfDataSelector, regDataSelector } from 'store/selectors/registration';
import { retinaSuffixSelector } from 'store/selectors/ui';

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
