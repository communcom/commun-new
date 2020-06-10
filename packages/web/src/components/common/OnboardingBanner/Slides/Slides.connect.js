import { connect } from 'react-redux';

import { SHOW_MODAL_SIGNUP } from 'store/constants';
import { openModal } from 'store/actions/modals';

import Slides from './Slides';

export default connect(null, {
  openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
})(Slides);
