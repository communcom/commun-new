import { connect } from 'react-redux';

import { createComment, updateComment } from 'store/actions/complex/content';
import { fetchPost, fetchPostComments, getEmbed, waitForTransaction } from 'store/actions/gate';
import { uiSelector } from 'store/selectors/common';

import CommentForm from './CommentForm';

export default connect(
  state => {
    const mode = uiSelector('mode')(state);
    const { filterSortBy } = uiSelector('comments')(state);

    return {
      isSSR: mode.isSSR,
      isMobile: mode.screenType === 'mobile',
      filterSortBy,
    };
  },
  {
    createComment,
    updateComment,
    fetchPost,
    fetchPostComments,
    getEmbed,
    waitForTransaction,
  }
)(CommentForm);
