import { connect } from 'react-redux';

import { createFastEqualSelector, statusSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { fetchPostComments } from 'store/actions/gate/comments';
import { setCommentsFilter } from 'store/actions/ui';
import { formatContentId } from 'store/schemas/gate';

import CommentsBlockFeed from './CommentsBlockFeed';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => statusSelector(['postComments', formatContentId(props.contentId)])(state),
      (state, props) => entitySelector('posts', formatContentId(props.contentId))(state),
      currentUserIdSelector,
      state => state.ui.comments,
    ],
    (commentsStatus = {}, post, loggedUserId, comments) => ({
      filterSortBy: comments.filterSortBy,
      order: commentsStatus.order || [],
      isLoading: commentsStatus.isLoading || false,
      totalCommentsCount: post ? post.stats.commentsCount : null,
      loggedUserId,
    })
  ),
  {
    fetchPostComments,
    setCommentsFilter,
  }
)(CommentsBlockFeed);
