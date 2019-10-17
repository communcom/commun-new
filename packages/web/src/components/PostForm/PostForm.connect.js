import { connect } from 'react-redux';

import { fetchPost, fetchMyCommunities, waitForTransaction } from 'store/actions/gate';
import { createPost, updatePost } from 'store/actions/complex/content';
import { getCommunityById } from 'store/actions/select';
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
      currentUser,
      post,
      myCommunities,
    })
  ),
  {
    fetchPost,
    createPost,
    updatePost,
    waitForTransaction,
    fetchMyCommunities,
    getCommunityById,
  }
)(PostForm);
