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
