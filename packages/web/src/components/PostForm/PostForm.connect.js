import { connect } from 'react-redux';

import { fetchPost, waitForTransaction } from 'store/actions/gate';
import { createPost, updatePost } from 'store/actions/complex/content';
import { createDeepEqualSelector, entitySelector } from 'store/selectors/common';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { formatContentId } from 'store/schemas/gate';

import PostForm from './PostForm';

const postSelector = (state, { contentId }) => {
  if (!contentId) {
    return null;
  }

  return entitySelector('posts', formatContentId(contentId))(state);
};

export default connect(
  createDeepEqualSelector([currentUnsafeUserSelector, postSelector], (currentUser, post) => ({
    loggedUserId: currentUser?.userId,
    post,
  })),
  {
    fetchPost,
    createPost,
    updatePost,
    waitForTransaction,
  }
)(PostForm);
