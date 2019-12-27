import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_REPORT } from 'store/constants';
import { isOwnerSelector } from 'store/selectors/user';
import { amILeaderSelector } from 'store/selectors/auth';
import { checkAuth, createBanPostProposalIfNeeded } from 'store/actions/complex';

import PostCardHeader from './PostCardHeader';

export default connect(
  createStructuredSelector({
    isOwner: (state, props) => isOwnerSelector(props.post.authorId)(state),
    isLeader: (state, props) => amILeaderSelector(props.post.communityId)(state),
  }),
  {
    checkAuth,
    openReportModal: contentId => openModal(SHOW_MODAL_REPORT, { contentId }),
    createBanPostProposalIfNeeded,
  }
)(PostCardHeader);
