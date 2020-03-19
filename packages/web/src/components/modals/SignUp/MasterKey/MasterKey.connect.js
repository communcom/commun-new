import { connect } from 'react-redux';

import { SHOW_MODAL_ONBOARDING_REGISTRATION } from 'store/constants';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { statusSelector, dataSelector } from 'store/selectors/common';
import { retinaSuffixSelector } from 'store/selectors/ui';
import { blockChainStopLoader, fetchToBlockChain } from 'store/actions/gate/registration';
import { clearRegErrors, clearRegistrationData } from 'store/actions/registration/registration';
import { getAirdrop } from 'store/actions/gate';
import { openModal } from 'store/actions/modals';

import MasterKey from './MasterKey';

export default connect(
  state => {
    const { isLoadingBlockChain, blockChainError } = statusSelector('registration')(state);
    const masterPassword = dataSelector(['registration', 'keys', 'master'])(state);
    const retinaSuffix = retinaSuffixSelector(state);
    const user = currentUnsafeUserSelector(state);
    const airdropCommunityId = dataSelector(['unauth', 'airdropCommunityId'])(state);

    return {
      user,
      airdropCommunityId,
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
    getAirdrop,
    openOnboarding: () => openModal(SHOW_MODAL_ONBOARDING_REGISTRATION),
  }
)(MasterKey);
