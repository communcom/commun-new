import { connect } from 'react-redux';

import { stopLeader, unregLeader, unVoteLeader, voteLeader } from 'store/actions/commun';
import { clearAllVotes } from 'store/actions/complex';
import { fetchLeaders, fetchProfile, waitForTransaction } from 'store/actions/gate';
import { openBecomeLeaderDialog, openConfirmDialog } from 'store/actions/modals';
import { entitySelector } from 'store/selectors/common';
import { screenTypeUp } from 'store/selectors/ui';

import Leaders from './Leaders';

export default connect(
  (state, props) => {
    const userId = props.currentUserId;
    const community = entitySelector('communities', props.communityId)(state);

    return {
      userId,
      isLeader: community.isLeader,
      isMobile: !screenTypeUp.tablet(state),
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
