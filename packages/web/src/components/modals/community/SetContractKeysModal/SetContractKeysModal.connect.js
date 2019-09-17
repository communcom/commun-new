import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { setContractsKeys } from 'store/actions/commun/community';

import SetContractKeysModal from './SetContractKeysModal';

export default connect(
  null,
  {
    openModal,
    setContractsKeys,
  }
)(SetContractKeysModal);
