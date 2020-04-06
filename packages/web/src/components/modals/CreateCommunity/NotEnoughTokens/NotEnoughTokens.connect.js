import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_EXCHANGE_COMMUN } from 'store/constants/modalTypes';

import NotEnoughTokens from './NotEnoughTokens';

export default connect(null, {
  openBuyCommunModal: (params = {}) => openModal(SHOW_MODAL_EXCHANGE_COMMUN, params),
})(NotEnoughTokens);
