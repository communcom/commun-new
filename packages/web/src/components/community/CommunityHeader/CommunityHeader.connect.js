import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { pin, unpin } from 'store/actions/commun/social';
import { fetchProfile } from 'store/actions/gate';
import { entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';

import CommunityHeader from './CommunityHeader';

export default connect(
  createSelector(
    [
      currentUserIdSelector,
      state => entitySelector('profiles', currentUserIdSelector(state))(state),
    ],
    (loggedUserId, profile) => {
      let subscriptions;

      if (profile) {
        subscriptions = profile.subscriptions.communities;
      }
      return {
        loggedUserId,
        subscriptions,
      };
    }
  ),
  {
    pin,
    unpin,
    fetchProfile,
  }
)(CommunityHeader);
