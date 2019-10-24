import { connect } from 'react-redux';

import { fetchNestedComments } from 'store/actions/gate/comments';
import { extendedPostCommentsSelector } from 'store/selectors/common';

import CommentsNested from './CommentsNested';

export default connect(
  (state, props) => ({
    comment: extendedPostCommentsSelector(props.commentId)(state),
  }),
  {
    fetchNestedComments,
  }
)(CommentsNested);
