import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { entitySelector } from 'store/selectors/common';

import SocialsPage from '../common/SocialsPage';

export default connect(
  createSelector([(state, props) => entitySelector('profiles', props.userId)(state)], profile => ({
    profile,
  })),
  {
    updateProfileMeta,
    fetchProfile,
    waitForTransaction,
  }
)(SocialsPage);
