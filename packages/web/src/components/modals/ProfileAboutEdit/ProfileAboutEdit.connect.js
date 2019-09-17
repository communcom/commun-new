import { connect } from 'react-redux';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { entitySelector } from 'store/selectors/common';

import ProfileAboutEdit from './ProfileAboutEdit';

export default connect(
  (state, props) => ({
    profile: entitySelector('profiles', props.userId)(state),
  }),
  {
    updateProfileMeta,
    fetchProfile,
    waitForTransaction,
  }
)(ProfileAboutEdit);
