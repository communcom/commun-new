import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';
import { withRouter } from 'next/router';

import { SHOW_MODAL_REPORT } from 'store/constants';
import { extendedPostSelector, uiSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { amILeaderSelector } from 'store/selectors/auth';
import { formatContentId } from 'store/schemas/gate';
import { recordPostView } from 'store/actions/gate/meta';
import { checkAuth, createBanPostProposalIfNeeded, deletePost } from 'store/actions/complex';
import { joinCommunity } from 'store/actions/commun';

import Post from './Post';

export default withRouter(
  connect(
    (state, props) => {
      let post = null;
      let isOwner = false;
      let isLeader = false;

      if (props.contentId) {
        post = extendedPostSelector(formatContentId(props.contentId))(state);
        isOwner = isOwnerSelector(post.authorId)(state);
        isLeader = amILeaderSelector(props.contentId.communityId)(state);
      }

      const screenType = uiSelector(['mode', 'screenType'])(state);

      // TODO:
      const isOriginalContent = true;
      const isAdultContent = true;

      return {
        post,
        isOwner,
        isLeader,
        isOriginalContent,
        isAdultContent,
        isMobile: screenType === 'mobile',
      };
    },
    {
      joinCommunity,
      checkAuth,
      recordPostView,
      openModal,
      createBanPostProposalIfNeeded,
      deletePost,
      openReportModal: contentId => openModal(SHOW_MODAL_REPORT, { contentId }),
    }
  )(Post)
);
