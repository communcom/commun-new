import { connect } from 'react-redux';

import {
  createFastEqualSelector,
  entitySelector,
  extendedProfileCommentsSelector,
} from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';

import CommentCard from './CommentCard';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => {
        const comment = extendedProfileCommentsSelector(props.commentId)(state);
        const isOwner = isOwnerSelector(comment.contentId.userId)(state);

        const isNested = Boolean(comment.parents.comment);
        const parentCommentId = !isNested ? comment.contentId : comment.parents.comment;
        const parentCommentAuthor = entitySelector('users', parentCommentId.userId)(state);

        return [comment, parentCommentId, parentCommentAuthor, isOwner];
      },
      currentUserIdSelector,
    ],
    ([comment, parentCommentId, parentCommentAuthor, isOwner], loggedUserId) => ({
      comment,
      parentCommentId,
      parentCommentAuthor,
      isOwner,
      loggedUserId,
    })
  )
)(CommentCard);
