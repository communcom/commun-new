import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
import { screenTypeUp } from 'store/selectors/ui';
import { isOwnerSelector } from 'store/selectors/user';

import About from './About';

export default connect(
  createSelector(
    [
      (state, props) => entitySelector('profiles', props.userId)(state),
      (state, props) => isOwnerSelector(props.userId)(state),
      screenTypeUp.desktop,
      selectFeatureFlags,
    ],
    (profile, isOwner, isDesktop, featureFlags) => ({
      profile,
      isOwner,
      isDesktop,
      featureFlags,
    })
  )
)(About);
