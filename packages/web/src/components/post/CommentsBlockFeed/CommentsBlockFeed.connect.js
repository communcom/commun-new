import { connect } from 'react-redux';

import { createDeepEqualSelector, statusSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { fetchPostComments } from 'store/actions/gate/comments';
import { formatContentId } from 'store/schemas/gate';

import { setCommentsFilter } from 'store/actions/ui';
import CommentsBlockFeed from './CommentsBlockFeed';

export default connect(
  createDeepEqualSelector(
    [
      (state, props) => statusSelector(['postComments', formatContentId(props.contentId)])(state),
      (state, props) => entitySelector('posts', formatContentId(props.contentId))(state),
      currentUserIdSelector,
      state => state.ui.comments,
    ],
    (commentsStatus = {}, post, loggedUserId, comments) => ({
      filterSortBy: comments.filterSortBy,
      order: commentsStatus.order || [],
      sequenceKey: commentsStatus.sequenceKey,
      isLoading: commentsStatus.isLoading,
      isAllowLoadMore: !commentsStatus.isLoading && !commentsStatus.isEnd,
      totalCommentsCount: post ? post.stats.commentsCount : null,
      loggedUserId,
    })
  ),
  {
    fetchPostComments,
    setCommentsFilter,
  }
)(CommentsBlockFeed);
