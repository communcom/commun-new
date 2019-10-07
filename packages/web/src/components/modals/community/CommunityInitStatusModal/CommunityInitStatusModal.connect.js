import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { createFastEqualSelector, statusSelector } from 'store/selectors/common';
import { createCommunity, retryCloneContract } from 'store/actions/commun/community';

import CommunityInitStatusModal from './CommunityInitStatusModal';

export default connect(
  createFastEqualSelector([statusSelector('contracts')], contracts => ({
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
