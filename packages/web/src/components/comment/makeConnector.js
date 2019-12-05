import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_POST } from 'store/constants';
import { createFastEqualSelector, modeSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { deleteComment } from 'store/actions/complex/content';

export default selector =>
  connect(
    createFastEqualSelector(
      [
        (state, props) => {
          const comment = selector(props.commentId)(state);
          const isOwner = isOwnerSelector(comment.contentId.userId)(state);
          const isNested = Boolean(comment.parents.comment);

          return [comment, isNested, isOwner];
        },
        currentUserIdSelector,
        modeSelector,
      ],
      ([comment, isNested, isOwner], loggedUserId, mode) => ({
        comment,
        isNested,
        isOwner,
        loggedUserId,
        isMobile: mode.screenType === 'mobile',
      })
    ),
    {
      deleteComment,
      openPost: (contentId, hash) => openModal(SHOW_MODAL_POST, { contentId, hash }),
    }
  );
