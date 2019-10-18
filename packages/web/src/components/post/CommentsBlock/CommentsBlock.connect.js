import { connect } from 'react-redux';

import {
  createFastEqualSelector,
  statusSelector,
  extendedPostSelector,
} from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { fetchPostComments } from 'store/actions/gate/comments';
import { formatContentId } from 'store/schemas/gate';

import { setCommentsFilter } from 'store/actions/ui';
import CommentsBlock from './CommentsBlock';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => statusSelector(['postComments', formatContentId(props.contentId)])(state),
      (state, props) => extendedPostSelector(formatContentId(props.contentId))(state),
      currentUserIdSelector,
      state => state.ui.comments,
    ],
    (commentsStatus = {}, post, loggedUserId, comments) => ({
      filterSortBy: comments.filterSortBy,
      order: commentsStatus.order || [],
      orderNew: commentsStatus.orderNew || [],
      sequenceKey: commentsStatus.sequenceKey || null,
      isLoading: commentsStatus.isLoading || false,
      isAllowLoadMore: !commentsStatus.isLoading && !commentsStatus.isEnd,
      post,
      loggedUserId,
    })
  ),
  {
    fetchPostComments,
    setCommentsFilter,
  }
)(CommentsBlock);
