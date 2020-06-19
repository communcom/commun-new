import { connect } from 'react-redux';

import { fetchNestedComments } from 'store/actions/gate/comments';
import { formatContentId } from 'store/schemas/gate';
import { entitySelector, extendedPostCommentSelector } from 'store/selectors/common';

import CommentsNested from './CommentsNested';

export default connect(
  (state, props) => {
    const comment = extendedPostCommentSelector(props.commentId)(state);
    const postId = formatContentId(comment.parents.post);
    const post = entitySelector('posts', postId)(state);

    return {
      comment,
      post,
    };
  },
  {
    fetchNestedComments,
  }
)(CommentsNested);
