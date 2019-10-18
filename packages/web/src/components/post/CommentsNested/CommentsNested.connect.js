import { connect } from 'react-redux';

import { fetchNestedComments } from 'store/actions/gate/comments';
import { entitySelector } from 'store/selectors/common';

import CommentsNested from './CommentsNested';

export default connect(
  (state, props) => ({
    comment: entitySelector('postComments', props.commentId)(state),
  }),
  {
    fetchNestedComments,
  }
)(CommentsNested);
