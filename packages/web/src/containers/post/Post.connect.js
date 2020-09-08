import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { withRouter } from 'next/router';

import { joinCommunity } from 'store/actions/commun';
import { checkAuth, createBanPostProposalIfNeeded, deletePost } from 'store/actions/complex';
import { fetchPostDonations, fetchReward } from 'store/actions/gate';
import { recordPostView } from 'store/actions/gate/meta';
import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_REPORT } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
import { amILeaderSelector } from 'store/selectors/auth';
import { extendedPostSelector, uiSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import Post from './Post';

export default withRouter(
  connect(
    (state, props) => {
      let post = null;
      let isOwner = false;
      let isLeader = false;

      if (props.contentId) {
        post = extendedPostSelector(formatContentId(props.contentId))(state);
        isOwner = isOwnerSelector(props.contentId.userId)(state);
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
        featureFlags: selectFeatureFlags(state),
        isMobile: screenType === 'mobile',
      };
    },
    {
      fetchReward,
      fetchPostDonations,
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
