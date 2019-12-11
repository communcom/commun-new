import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { voteLeader, unVoteLeader, stopLeader, unregLeader } from 'store/actions/commun';
import { fetchLeaders, fetchProfile, waitForTransaction } from 'store/actions/gate';
import { openBecomeLeaderDialog, openConfirmDialog } from 'store/actions/modals';
import { clearAllVotes } from 'store/actions/complex';

import Leaders from './Leaders';

export default connect(
  (state, props) => {
    const userId = props.currentUserId;
    const community = entitySelector('communities', props.communityId)(state);

    return {
      userId,
      isLeader: community.isLeader,
      isStoppedLeader: community.isStoppedLeader,
    };
  },
  {
    voteLeader,
    unVoteLeader,
    fetchLeaders,
    openBecomeLeaderDialog,
    openConfirmDialog,
    waitForTransaction,
    stopLeader,
    clearAllVotes,
    unregLeader,
    fetchProfile,
  }
)(Leaders);
