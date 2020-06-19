import { connect } from 'react-redux';

import { fetchPostComments } from 'store/actions/gate/comments';
import { formatContentId } from 'store/schemas/gate';
import { currentUserIdSelector } from 'store/selectors/auth';
import {
  createFastEqualSelector,
  extendedPostSelector,
  statusSelector,
} from 'store/selectors/common';

import CommentsBlockFeed from './CommentsBlockFeed';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => statusSelector(['postComments', formatContentId(props.contentId)])(state),
      (state, props) => extendedPostSelector(formatContentId(props.contentId))(state),
      currentUserIdSelector,
    ],
    (commentsStatus = {}, post, loggedUserId) => ({
      order: commentsStatus.order || [],
      orderNew: commentsStatus.orderNew || [],
      isLoading: commentsStatus.isLoading || false,
      isAllowLoadMore: !commentsStatus.isLoading && !commentsStatus.isEnd,
      post,
      loggedUserId,
    })
  ),
  {
    fetchPostComments,
  }
)(CommentsBlockFeed);
