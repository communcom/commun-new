import { connect } from 'react-redux';

import { isOwnerSelector } from 'store/selectors/user';
import { entitySelector } from 'store/selectors/common';
import { vote } from 'store/actions/complex/votes';
import { fetchPost, waitForTransaction, fetchComment } from 'store/actions/gate';
import { checkAuth } from 'store/actions/complex';

import VotePanel from './VotePanel';

export default connect(
  (state, props) => ({
    isOwner: isOwnerSelector(props.entity.contentId.userId)(state),
    author: entitySelector('users', props.entity.contentId.userId)(state),
  }),
  {
    vote,
    fetchPost,
    fetchComment,
    waitForTransaction,
    checkAuth,
  }
)(VotePanel);
