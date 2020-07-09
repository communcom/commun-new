import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import SideBarNavigation from './SideBarNavigation';

export default connect(
  createSelector([selectFeatureFlags], featureFlags => ({
    featureFlags,
  }))
)(SideBarNavigation);
