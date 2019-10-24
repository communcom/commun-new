import { connect } from 'react-redux';

import { entityArraySelector, statusSelector, entitySelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { voteLeader, unVoteLeader, stopLeader } from 'store/actions/commun';
import { fetchLeaders, waitForTransaction } from 'store/actions/gate';
import { openBecomeLeaderDialog, openConfirmDialog } from 'store/actions/modals';

import Leaders from './Leaders';

export default connect(
  state => {
    const { order, isEnd, prefix, fetchPrefix, isLoading } = statusSelector('leaders')(state);
    const items = entityArraySelector('leaders', order)(state);

    const userId = currentUnsafeUserIdSelector(state);
    let currentlyLeaderIn = null;

    if (userId) {
      const profile = entitySelector('profiles', userId)(state);

      currentlyLeaderIn = profile?.leaderIn;
    }

    return {
      userId,
      currentlyLeaderIn,
      items,
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
  }
)(Leaders);
