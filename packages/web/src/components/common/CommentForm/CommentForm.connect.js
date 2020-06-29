import { connect } from 'react-redux';

import { checkAuth } from 'store/actions/complex';
import { createComment, updateComment } from 'store/actions/complex/content';
import { fetchComment, getEmbed, waitForTransaction } from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector, uiSelector } from 'store/selectors/common';

import CommentForm from './CommentForm';

export default connect(
  state => {
    const mode = uiSelector('mode')(state);
    const { filterSortBy } = uiSelector('comments')(state);
    const { isMaintenance } = dataSelector('config')(state);

    return {
      isHydration: mode.isHydration,
      isMobile: mode.screenType === 'mobile',
      filterSortBy,
      loggedUserId: currentUserIdSelector(state),
      isMaintenance,
    };
  },
  {
    createComment,
    updateComment,
    fetchComment,
    getEmbed,
    waitForTransaction,
    checkAuth,
  }
)(CommentForm);
