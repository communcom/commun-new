import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector, dataSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import UserProfile from './UserProfile';

export default connect(
  createSelector(
    [
      (state, props) => entitySelector('profiles', props.userId)(state),
      (state, props) => isOwnerSelector(props.userId)(state, props),
      dataSelector(['auth', 'isAutoLogging']),
    ],
    (profile, isOwner, isAutoLogging) => ({
      profile,
      isAutoLogging,
      isOwner,
    })
  )
)(UserProfile);
