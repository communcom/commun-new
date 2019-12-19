import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';
import { withRouter } from 'next/router';

import { recordPostView } from 'store/actions/gate/meta';
import { extendedPostSelector, uiSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { formatContentId } from 'store/schemas/gate';
import { SHOW_MODAL_REPORT } from 'store/constants';
import { checkAuth } from 'store/actions/complex';

import Post from './Post';

export default withRouter(
  connect(
    (state, props) => {
      let post = null;
      let isOwner = false;

      if (props.contentId) {
        post = extendedPostSelector(formatContentId(props.contentId))(state);
        isOwner = isOwnerSelector(post.authorId)(state);
      }

      const screenType = uiSelector(['mode', 'screenType'])(state);

      // TODO:
      const isOriginalContent = true;
      const isAdultContent = true;

      return {
        post,
        isOwner,
        isOriginalContent,
        isAdultContent,
        isMobile: screenType === 'mobile',
      };
    },
    {
      checkAuth,
      recordPostView,
      openModal,
      openReportModal: contentId => openModal(SHOW_MODAL_REPORT, { contentId }),
    }
  )(Post)
);
