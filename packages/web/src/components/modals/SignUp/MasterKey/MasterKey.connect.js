import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_REGISTRATION } from 'store/constants';
import { statusSelector, dataSelector } from 'store/selectors/common';
import { blockChainStopLoader, fetchToBlockChain } from 'store/actions/gate/registration';
import { clearRegErrors, clearRegistrationData } from 'store/actions/registration/registration';

import MasterKey from './MasterKey';

export default connect(
  state => {
    const { isLoadingBlockChain, blockChainError } = statusSelector('registration')(state);
    const masterPassword = dataSelector(['registration', 'keys', 'master'])(state);

    return {
      masterPassword,
      isLoadingBlockChain,
      blockChainError,
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
