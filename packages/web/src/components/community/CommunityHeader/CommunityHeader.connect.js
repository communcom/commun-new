import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchProfile } from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';
import { joinCommunity, leaveCommunity } from 'store/actions/commun';

import CommunityHeader from './CommunityHeader';

export default connect(
  createSelector(
    [currentUserIdSelector],
    loggedUserId => ({
      loggedUserId,
    })
  ),
  {
    joinCommunity,
    leaveCommunity,
    fetchProfile,
  }
)(CommunityHeader);
