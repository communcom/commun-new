import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_REGISTRATION } from 'store/constants';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { statusSelector, dataSelector } from 'store/selectors/common';
import { retinaSuffixSelector } from 'store/selectors/ui';
import { blockChainStopLoader, fetchToBlockChain } from 'store/actions/gate/registration';
import { clearRegErrors, clearRegistrationData } from 'store/actions/registration/registration';

import MasterKey from './MasterKey';

export default connect(
  state => {
    const { isLoadingBlockChain, blockChainError } = statusSelector('registration')(state);
    const masterPassword = dataSelector(['registration', 'keys', 'master'])(state);
    const retinaSuffix = retinaSuffixSelector(state);
    const user = currentUnsafeUserSelector(state);

    return {
      user,
      masterPassword,
      isLoadingBlockChain,
      blockChainError,
      retinaSuffix,
    };
  },
  {
    fetchToBlockChain,
    blockChainStopLoader,
    clearRegErrors,
    clearRegistrationData,
    openOnboarding: () => openModal(SHOW_MODAL_ONBOARDING_REGISTRATION),
  }
)(MasterKey);
