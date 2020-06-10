import { connect } from 'react-redux';

import { extendedProposalSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import {
  approveProposal,
  execProposal,
  cancelProposalApprove,
  cancelProposal,
} from 'store/actions/commun/proposal';
import { openConfirmDialog } from 'store/actions/modals/confirm';

import ProposalCard from './ProposalCard';

export default connect(
  (state, props) => ({
    userId: currentUserIdSelector(state),
    proposal: extendedProposalSelector(props.proposalId)(state),
  }),
  {
    openConfirmDialog,
    approveProposal,
    execProposal,
    cancelProposalApprove,
    cancelProposal,
  }
)(ProposalCard);
