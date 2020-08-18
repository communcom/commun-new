import { connect } from 'react-redux';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';

import EditContact from './EditContact';

export default connect(null, {
  updateProfileMeta,
  fetchProfile,
  waitForTransaction,
})(EditContact);
