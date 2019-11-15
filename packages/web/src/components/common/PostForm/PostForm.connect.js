import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { fetchPost, waitForTransaction } from 'store/actions/gate';
import { createPost, updatePost, fetchMyCommunitiesIfEmpty } from 'store/actions/complex';
import { getCommunityById } from 'store/actions/select';
import {
  createFastEqualSelector,
  entitiesSelector,
  entitySelector,
  modeSelector,
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

// need withRouter
const communitySelector = (state, { contentId, isEdit, router: { query } }) => {
  if (contentId && isEdit) {
    return entitySelector('communities', contentId.communityId)(state);
  }

  // TODO: better
  // solution, which find current community by communityAlias from query
  if (query.communityAlias) {
    const communities = entitiesSelector('communities')(state);
    return Object.values(communities).find(community => community.alias === query.communityAlias);
  }

  return null;
};

export default compose(
  withRouter,
  connect(
    createFastEqualSelector(
      [currentUnsafeUserSelector, postSelector, communitySelector, modeSelector],
      (currentUser, post, mode, community) => ({
        currentUser,
        post,
        community,
        isMobile: mode.screenType === 'mobile',
      })
    ),
    {
      fetchPost,
      createPost,
      updatePost,
      waitForTransaction,
      getCommunityById,
      fetchMyCommunitiesIfEmpty,
    }
  )
)(PostForm);
