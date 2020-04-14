import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import General from './General';

export default connect(
  createSelector([selectFeatureFlags], featureFlags => ({
    featureFlags,
  }))
)(General);
