import { connect } from 'react-redux';

import { entityArraySelector, statusSelector, entitySelector } from 'store/selectors/common';
import { voteLeader, unVoteLeader, stopLeader, unregLeader } from 'store/actions/commun';
import { fetchLeaders, waitForTransaction } from 'store/actions/gate';
import { openBecomeLeaderDialog, openConfirmDialog } from 'store/actions/modals';
import { clearAllVotes } from 'store/actions/complex';

import Leaders from './Leaders';

export default connect(
  (state, props) => {
    const { order, isEnd, prefix, fetchPrefix, isLoading } = statusSelector('leaders')(state);
    const items = entityArraySelector('leaders', order)(state);
    const userId = props.currentUserId;

    const community = entitySelector('communities', props.communityId)(state);

    return {
      userId,
      items,
      isLeader: community.isLeader,
      isStoppedLeader: community.isStoppedLeader,
      prefix,
      fetchPrefix,
      isEnd,
      isLoading,
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
  }
)(Leaders);
