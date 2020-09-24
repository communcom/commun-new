import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { screenTypeDown } from 'store/selectors/ui';

import SideBarNavigation from './SideBarNavigation';

export default connect(
  createSelector([selectFeatureFlags, screenTypeDown.tablet], (featureFlags, isMobile) => ({
    featureFlags,
    isMobile,
  }))
)(SideBarNavigation);
