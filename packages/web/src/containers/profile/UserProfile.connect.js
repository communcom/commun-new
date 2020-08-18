import { connect } from 'react-redux';
import { selectFeatureFlag } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { dataSelector, entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import UserProfile from './UserProfile';

export default connect(
  createSelector(
    [
      (state, props) => entitySelector('profiles', props.userId)(state),
      (state, props) => isOwnerSelector(props.userId)(state, props),
      dataSelector(['auth', 'isAutoLogging']),
      selectFeatureFlag,
    ],
    (profile, isOwner, isAutoLogging, featureFlags) => ({
      profile,
      isAutoLogging,
      isOwner,
      featureFlags, // just for rerender when featureFlags will restore on client
    })
  )
)(UserProfile);
