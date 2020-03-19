import { connect } from 'react-redux';

import { SHOW_MODAL_LOGIN } from 'store/constants';
import { openModal } from 'store/actions/modals';

import SwitchToApp from './SwitchToApp';

export default connect(null, {
  openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
})(SwitchToApp);
