import { connect } from 'react-redux';

import { createComment, updateComment } from 'store/actions/complex/content';
import { fetchComment, fetchPost, getEmbed, waitForTransaction } from 'store/actions/gate';
import { checkAuth } from 'store/actions/complex';
import { currentUserIdSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';

import CommentForm from './CommentForm';

export default connect(
  state => {
    const mode = uiSelector('mode')(state);
    const { filterSortBy } = uiSelector('comments')(state);

    return {
      isHydration: mode.isHydration,
      isMobile: mode.screenType === 'mobile',
      filterSortBy,
      loggedUserId: currentUserIdSelector(state),
    };
  },
  {
    createComment,
    updateComment,
    fetchComment,
    fetchPost,
    getEmbed,
    waitForTransaction,
    checkAuth,
  }
)(CommentForm);
