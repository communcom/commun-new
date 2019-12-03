import { connect } from 'react-redux';

import { deleteComment } from 'store/actions/complex/content';
import {
  createFastEqualSelector,
  modeSelector,
  extendedPostCommentSelector,
} from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';

import Comment from './Comment';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => {
        const comment = extendedPostCommentSelector(props.commentId)(state);
        const isOwner = isOwnerSelector(comment.contentId.userId)(state);

        const isNested = Boolean(comment.parents.comment);
        const replyToCommentId = isNested ? comment.parents.comment : comment.contentId;

        return [comment, replyToCommentId, isNested, isOwner];
      },
      currentUserIdSelector,
      modeSelector,
    ],
    ([comment, replyToCommentId, isNested, isOwner], loggedUserId, mode) => ({
      comment,
      replyToCommentId,
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
