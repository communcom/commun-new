import { connect } from 'react-redux';

import { fetchPostComments } from 'store/actions/gate/comments';
import { setCommentsFilter } from 'store/actions/ui';
import { formatContentId } from 'store/schemas/gate';
import { currentUserIdSelector } from 'store/selectors/auth';
import {
  createFastEqualSelector,
  extendedPostSelector,
  statusSelector,
} from 'store/selectors/common';

import CommentsBlock from './CommentsBlock';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => statusSelector(['postComments', formatContentId(props.contentId)])(state),
      (state, props) => extendedPostSelector(formatContentId(props.contentId))(state),
      currentUserIdSelector,
      state => state.ui.comments,
    ],
    (status, post, loggedUserId, comments) => {
      let order = [];

      if (status) {
        order = status.order.concat(status.orderNew);
      }

      return {
        filterSortBy: comments.filterSortBy,
        order,
        showLoader: !status || status.isLoading,
        isAllowLoadMore: status ? !status.isLoading && !status.isEnd : true,
        loggedUserId,
        post,
      };
    }
  ),
  {
    fetchPostComments,
    setCommentsFilter,
  }
)(CommentsBlock);
