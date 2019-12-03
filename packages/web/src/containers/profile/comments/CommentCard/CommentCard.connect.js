import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_POST } from 'store/constants';
import { createFastEqualSelector, extendedProfileCommentSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { deleteComment } from 'store/actions/complex/content';

import CommentCard from './CommentCard';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => {
        const comment = extendedProfileCommentSelector(props.commentId)(state);
        const isOwner = isOwnerSelector(comment.contentId.userId)(state);

        const isNested = Boolean(comment.parents.comment);
        const replyToCommentId = isNested ? comment.parents.comment : comment.contentId;

        return [comment, replyToCommentId, isOwner];
      },
      currentUserIdSelector,
    ],
    ([comment, replyToCommentId, isOwner], loggedUserId) => ({
      comment,
      replyToCommentId,
      isOwner,
      loggedUserId,
    })
  ),
  {
    deleteComment,
    openPost: (contentId, hash) => openModal(SHOW_MODAL_POST, { contentId, hash }),
  }
)(CommentCard);
