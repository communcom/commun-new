import { connect } from 'react-redux';

import { createFastEqualSelector, statusSelector } from 'store/selectors/common';

import { setCommentsFilter } from 'store/actions/ui';
import { fetchUserComments } from 'store/actions/gate/comments';
import Comments from './Comments';

export default connect(
  createFastEqualSelector(
    [statusSelector('profileComments'), state => state.ui.comments],
    (commentsStatus, comments) => ({
      filterSortBy: comments.filterSortBy,
      totalCommentsCount: commentsStatus.order ? commentsStatus.order.length : 0,
      order: commentsStatus.order,
      sequenceKey: commentsStatus.sequenceKey,
      isAllowLoadMore: !commentsStatus.isLoading && !commentsStatus.isEnd,
    })
  ),
  {
    setCommentsFilter,
    fetchUserComments,
  }
)(Comments);
