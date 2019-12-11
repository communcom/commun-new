import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { unVoteLeader, voteLeader } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';

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
    voteLeader,
    unVoteLeader,
    fetchProfile,
    waitForTransaction,
  }
)(LeaderRow);
