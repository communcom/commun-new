import { connect } from 'react-redux';

import { fetchRegVerifyEmail, fetchResendEmail } from 'store/actions/gate/registration';
import { clearRegErrors } from 'store/actions/local/registration';

import ConfirmEmail from './ConfirmEmail';

export default connect(null, {
  fetchRegVerifyEmail,
  fetchResendEmail,
  clearRegErrors,
})(ConfirmEmail);
