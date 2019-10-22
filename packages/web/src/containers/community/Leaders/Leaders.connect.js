import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { fetchLeaders, waitForTransaction } from 'store/actions/gate';
import { openBecomeLeaderDialog } from 'store/actions/modals';

import Leaders from './Leaders';

export default connect(
  state => {
    const { items, isEnd, isLoading } = dataSelector('leaders')(state);

    return {
      userId: currentUnsafeUserIdSelector(state),
      leaders: items,
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
