import { connect } from 'react-redux';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { screenTypeDown } from 'store/selectors/ui';

import SocialsPage from './SocialsPage';

export default connect(
  state => ({
    isMobile: screenTypeDown.mobileLandscape(state),
  }),
  {
    updateProfileMeta,
    fetchProfile,
    waitForTransaction,
  }
)(SocialsPage);
