import { connect } from 'react-redux';

import {
  approveProposal,
  cancelProposalApprove,
  createAndApproveBanPostProposal,
  execProposal,
} from 'store/actions/commun';
import { fetchProposal, waitForTransaction } from 'store/actions/gate';
import { removeReport } from 'store/actions/local';
import { extendedProposalSelector } from 'store/selectors/common';

import EntityCardReports from './EntityCardReports';

export default connect(
  (state, { entity }) => ({
    proposal: extendedProposalSelector(entity.proposal)(state),
  }),
  {
    createAndApproveBanPostProposal,
    approveProposal,
    cancelProposalApprove,
    execProposal,
    fetchProposal,
    waitForTransaction,
    removeReport,
  }
)(EntityCardReports);
