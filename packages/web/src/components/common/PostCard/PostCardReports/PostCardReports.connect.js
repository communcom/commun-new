import { connect } from 'react-redux';

import { extendedProposalSelector } from 'store/selectors/common';
import {
  createAndApproveBanPostProposal,
  approveProposal,
  execProposal,
  cancelProposalApprove,
} from 'store/actions/commun';
import { fetchProposal, waitForTransaction } from 'store/actions/gate';

import PostCardReports from './PostCardReports';

export default connect(
  (state, { post }) => ({
    proposal: extendedProposalSelector(post.proposal)(state),
  }),
  {
    createAndApproveBanPostProposal,
    approveProposal,
    cancelProposalApprove,
    execProposal,
    fetchProposal,
    waitForTransaction,
  }
)(PostCardReports);
