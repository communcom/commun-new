import { connect } from 'react-redux';
import { closeModal } from 'redux-modals-manager';

import ModalManager from './ModalManager';

export default connect(
  state => ({
    modals: state.modals,
  }),
  {
    closeModal,
  }
)(ModalManager);
