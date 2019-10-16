import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { pin, unpin } from 'store/actions/commun/social';
import { fetchProfile } from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';

import CommunityHeader from './CommunityHeader';

export default connect(
  createSelector(
    [currentUserIdSelector],
    loggedUserId => ({
      loggedUserId,
      // TODO: Get from store
      userCommunities: [],
    })
  ),
  {
    pin,
    unpin,
    fetchProfile,
  }
)(CommunityHeader);
