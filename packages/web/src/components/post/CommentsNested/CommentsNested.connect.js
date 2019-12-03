import { connect } from 'react-redux';

import { formatContentId } from 'store/schemas/gate';
import { fetchNestedComments } from 'store/actions/gate/comments';
import { extendedPostCommentSelector, entitySelector } from 'store/selectors/common';

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
