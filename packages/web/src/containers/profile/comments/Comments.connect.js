import { connect } from 'react-redux';

import { createFastEqualSelector, statusSelector } from 'store/selectors/common';

import { fetchUserComments } from 'store/actions/gate/comments';
import Comments from './Comments';

export default connect(
  createFastEqualSelector([statusSelector('profileComments')], commentsStatus => ({
    totalCommentsCount: commentsStatus.order ? commentsStatus.order.length : 0,
    order: commentsStatus.order,
    isAllowLoadMore: !commentsStatus.isLoading && !commentsStatus.isEnd,
  })),
  {
    fetchUserComments,
  }
)(Comments);
