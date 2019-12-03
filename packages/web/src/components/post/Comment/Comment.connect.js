import { connect } from 'react-redux';

import { deleteComment } from 'store/actions/complex/content';
import { createFastEqualSelector, entitySelector, modeSelector } from 'store/selectors/common';
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
        const parentCommentId = isNested ? comment.parents.comment : comment.contentId;

        return [comment, author, parentCommentId, isNested, isOwner];
      },
      currentUserIdSelector,
      modeSelector,
    ],
    ([comment, author, parentCommentId, isNested, isOwner], loggedUserId, mode) => ({
      comment,
      author,
      parentCommentId,
      isNested,
      isOwner,
      loggedUserId,
      isMobile: mode.screenType === 'mobile',
    })
  ),
  {
    deleteComment,
  }
)(Comment);
