import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_SIGNUP } from 'store/constants';

import GetFirstPointsWidget from './GetFirstPointsWidget';

export default connect(null, { openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP) })(
  GetFirstPointsWidget
);
