import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_LOGIN } from 'store/constants';

import SwitchToApp from './SwitchToApp';

export default connect(null, {
  openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
})(SwitchToApp);
