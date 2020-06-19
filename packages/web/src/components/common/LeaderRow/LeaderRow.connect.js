import { connect } from 'react-redux';

import { unVoteLeader } from 'store/actions/commun';
import { voteLeaderWithCheck } from 'store/actions/complex';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import LeaderRow from './LeaderRow';

export default connect(
  (state, props) => {
    const leader = entitySelector('leaders', `${props.communityId}/${props.userId}`)(state);
    return {
      currentUserId: currentUserIdSelector(state),
      leader,
    };
  },
  {
    voteLeaderWithCheck,
    unVoteLeader,
    fetchProfile,
    waitForTransaction,
  }
)(LeaderRow);
