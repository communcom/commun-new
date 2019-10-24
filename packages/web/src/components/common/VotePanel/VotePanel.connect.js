import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { vote } from 'store/actions/complex/votes';
import { fetchPost, waitForTransaction } from 'store/actions/gate';
import { checkAuth } from 'store/actions/complex';

import VotePanel from './VotePanel';

export default connect(
  state => ({
    loggedUserId: currentUserIdSelector(state),
  }),
  {
    vote,
    fetchPost,
    waitForTransaction,
    checkAuth,
  }
)(VotePanel);
