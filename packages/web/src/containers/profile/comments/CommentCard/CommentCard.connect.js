import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_POST } from 'store/constants';
import { createFastEqualSelector, extendedProfileCommentsSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { deleteComment } from 'store/actions/complex/content';

import CommentCard from './CommentCard';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => {
        const comment = extendedProfileCommentsSelector(props.commentId)(state);
        const isOwner = isOwnerSelector(comment.contentId.userId)(state);

        const isNested = Boolean(comment.parents.comment);
        const parentCommentId = isNested ? comment.parents.comment : comment.contentId;

        return [comment, parentCommentId, isOwner];
      },
      currentUserIdSelector,
    ],
    ([comment, parentCommentId, isOwner], loggedUserId) => ({
      comment,
      parentCommentId,
      isOwner,
      loggedUserId,
    })
  ),
  {
    deleteComment,
    openPost: (contentId, hash) => openModal(SHOW_MODAL_POST, { contentId, hash }),
  }
)(CommentCard);
