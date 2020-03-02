import { connect } from 'react-redux';

import { createFastEqualSelector, statusSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import { fetchUserComments } from 'store/actions/gate/comments';
import Comments from './Comments';

export default connect(
  createFastEqualSelector(
    [statusSelector('profileComments'), (state, props) => isOwnerSelector(props.userId)(state)],
    (commentsStatus, isOwner) => ({
      totalCommentsCount: commentsStatus.order ? commentsStatus.order.length : 0,
      order: commentsStatus.order,
      nextOffset: commentsStatus.nextOffset,
      isAllowLoadMore: !commentsStatus.isLoading && !commentsStatus.isEnd,
      isOwner,
    })
  ),
  {
    fetchUserComments,
  }
)(Comments);
