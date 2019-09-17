import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { currentUserIdSelector } from 'store/selectors/auth';
import { vote } from 'store/actions/complex/votes';
import { fetchPost, waitForTransaction } from 'store/actions/gate';

import VotePanel from './VotePanel';

export default connect(
  state => ({
    loggedUserId: currentUserIdSelector(state),
  }),
  {
    vote,
    fetchPost,
    waitForTransaction,
    openModal,
  }
)(VotePanel);
