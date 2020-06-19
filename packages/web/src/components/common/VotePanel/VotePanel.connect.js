import { connect } from 'react-redux';

import { checkAuth } from 'store/actions/complex';
import { vote } from 'store/actions/complex/votes';
import { fetchComment, fetchPost, waitForTransaction } from 'store/actions/gate';
import { entitySelector, modeSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import VotePanel from './VotePanel';

export default connect(
  (state, props) => ({
    isOwner: isOwnerSelector(props.entity.contentId.userId)(state),
    author: entitySelector('users', props.entity.contentId.userId)(state),
    isMobile: modeSelector(state).screenType === 'mobile',
  }),
  {
    vote,
    fetchPost,
    fetchComment,
    waitForTransaction,
    checkAuth,
  }
)(VotePanel);
