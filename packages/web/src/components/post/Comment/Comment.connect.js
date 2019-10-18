import { connect } from 'react-redux';

import { deleteComment } from 'store/actions/complex/content';
import { createFastEqualSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';

import Comment from './Comment';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => {
        const comment = entitySelector('postComments', props.commentId)(state);
        const author = entitySelector('users', comment.contentId.userId)(state);
        const isOwner = isOwnerSelector(comment.contentId.userId)(state);

        const isNested = Boolean(comment.parents.comment);
        const parentCommentId = !isNested ? comment.contentId : comment.parents.comment;
        const parentCommentAuthor = entitySelector('users', parentCommentId.userId)(state);

        return [comment, author, parentCommentAuthor, parentCommentId, isNested, isOwner];
      },
      currentUserIdSelector,
    ],
    ([comment, author, parentCommentAuthor, parentCommentId, isNested, isOwner], loggedUserId) => ({
      comment,
      author,
      parentCommentAuthor,
      parentCommentId,
      isNested,
      isOwner,
      loggedUserId,
    })
  ),
  { deleteComment }
)(Comment);
