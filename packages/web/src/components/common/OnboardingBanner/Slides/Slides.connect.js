import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_SIGNUP } from 'store/constants';

import Slides from './Slides';

export default connect(null, {
  openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
})(Slides);
