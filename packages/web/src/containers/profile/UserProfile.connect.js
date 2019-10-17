import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector, dataSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import { selectFeatureFlags } from '@flopflip/react-redux';
import UserProfile from './UserProfile';

export default connect(
  createSelector(
    [
      (state, props) => entitySelector('profiles', props.userId)(state),
      (state, props) => isOwnerSelector(props.userId)(state, props),
      dataSelector(['auth', 'isAutoLogging']),
      selectFeatureFlags,
    ],
    (profile, isOwner, isAutoLogging, featureFlags) => ({
      profile,
      isAutoLogging,
      isOwner,
      featureFlags,
    })
  )
)(UserProfile);
