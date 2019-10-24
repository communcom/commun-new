import { connect } from 'react-redux';

import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { fetchLeaders, waitForTransaction } from 'store/actions/gate';
import { openBecomeLeaderDialog } from 'store/actions/modals';

import Leaders from './Leaders';

export default connect(
  state => {
    const { order, isEnd, prefix, fetchPrefix, isLoading } = statusSelector('leaders')(state);
    const items = entityArraySelector('leaders', order)(state);

    return {
      userId: currentUnsafeUserIdSelector(state),
      items,
      prefix,
      fetchPrefix,
      isEnd,
      isLoading,
    };
  },
  {
    fetchLeaders,
    openBecomeLeaderDialog,
    waitForTransaction,
  }
)(Leaders);
