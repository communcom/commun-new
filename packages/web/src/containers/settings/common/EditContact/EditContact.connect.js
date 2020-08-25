import { connect } from 'react-redux';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { screenTypeDown } from 'store/selectors/ui';

import EditContact from './EditContact';

export default connect(
  state => ({
    isMobile: screenTypeDown.mobileLandscape(state),
  }),
  {
    updateProfileMeta,
    fetchProfile,
    waitForTransaction,
  }
)(EditContact);
