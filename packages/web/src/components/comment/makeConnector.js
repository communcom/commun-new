import { connect } from 'react-redux';

import { deleteComment } from 'store/actions/complex/content';
import { openDonateModal, openDonationsModal, openModal } from 'store/actions/modals';
import { SHOW_MODAL_POST, SHOW_MODAL_REPORT } from 'store/constants';
import { currentUserIdSelector } from 'store/selectors/auth';
import { createFastEqualSelector, entitySelector, modeSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

const makeConnector = selector =>
  connect(
    createFastEqualSelector(
      [
        (state, props) => {
          const comment = selector(props.commentId)(state);
          const displayReward = entitySelector('rewards', props.commentId)(state)?.displayReward;
          const displayDonations = entitySelector('donations', props.commentId)(state)?.totalAmount;
          const isOwner = isOwnerSelector(comment.contentId.userId)(state);
          const isNested = Boolean(comment.parents.comment);

          return [comment, displayReward, displayDonations, isNested, isOwner];
        },
        currentUserIdSelector,
        modeSelector,
      ],
      ([comment, displayReward, displayDonations, isNested, isOwner], loggedUserId, mode) => ({
        comment,
        displayReward,
        displayDonations,
        isNested,
        isOwner,
        loggedUserId,
        isMobile: mode.screenType === 'mobile',
      })
    ),
    {
      deleteComment,
      openReportModal: contentId => openModal(SHOW_MODAL_REPORT, { contentId }),
      openDonateModal,
      openDonationsModal,
      openPost: (contentId, hash) => openModal(SHOW_MODAL_POST, { contentId, hash }),
    }
  );

export default makeConnector;
