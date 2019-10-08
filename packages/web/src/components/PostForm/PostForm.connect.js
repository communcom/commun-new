import { connect } from 'react-redux';

import { fetchPost, fetchCommunities, waitForTransaction } from 'store/actions/gate';
import { createPost, updatePost } from 'store/actions/complex/content';
import {
  createFastEqualSelector,
  entitySelector,
  myCommunitiesSelector,
} from 'store/selectors/common';
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
  createFastEqualSelector(
    [currentUnsafeUserSelector, postSelector, myCommunitiesSelector],
    (currentUser, post, myCommunities) => ({
      loggedUserId: currentUser?.userId,
      post,
      myCommunities,
    })
  ),
  {
    fetchPost,
    createPost,
    updatePost,
    waitForTransaction,
    fetchCommunities,
  }
)(PostForm);
