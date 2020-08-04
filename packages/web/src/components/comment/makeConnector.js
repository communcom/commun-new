import { connect } from 'react-redux';

import { deleteComment } from 'store/actions/complex/content';
import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_POST, SHOW_MODAL_REPORT } from 'store/constants';
import { currentUserIdSelector } from 'store/selectors/auth';
import { createFastEqualSelector, modeSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

const makeConnector = selector =>
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
      openReportModal: contentId => openModal(SHOW_MODAL_REPORT, { contentId }),
      openPost: (contentId, hash) => openModal(SHOW_MODAL_POST, { contentId, hash }),
    }
  );

export default makeConnector;
