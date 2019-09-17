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
      // TODO replace with real subscribes
      /* user ? user.subscribes : null */
      subscriptions: [
        {
          id: 'photographers',
          name: 'photographers',
          followersQuantity: 342,
        },
        {
          id: 'overwatch',
          name: 'overwatch',
          followersQuantity: 12943,
        },
        {
          id: 'adme',
          name: 'adme',
          followersQuantity: 501475,
        },
        {
          id: 'something',
          name: 'something',
          followersQuantity: 2010,
        },
      ],
      isOwner,
      featureFlags,
    })
  )
)(UserProfile);
