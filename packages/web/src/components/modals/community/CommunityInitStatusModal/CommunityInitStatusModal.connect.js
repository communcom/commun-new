import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { createDeepEqualSelector, statusSelector } from 'store/selectors/common';
import { createCommunity, retryCloneContract } from 'store/actions/commun/community';

import CommunityInitStatusModal from './CommunityInitStatusModal';

export default connect(
  createDeepEqualSelector([statusSelector('contracts')], contracts => ({
    contractTypes: contracts.contractTypes,
    initContracts: contracts.initContracts,
    errors: contracts.errors,
  })),
  {
    openModal,
    createCommunity,
    retryCloneContract,
  }
)(CommunityInitStatusModal);
