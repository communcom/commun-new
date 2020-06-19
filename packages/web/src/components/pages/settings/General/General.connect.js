import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import General from './General';

export default connect(
  createSelector([selectFeatureFlags], featureFlags => ({
    featureFlags,
  }))
)(General);
