import { connect } from 'react-redux';

import {
  approveProposal,
  cancelProposal,
  cancelProposalApprove,
  execProposal,
} from 'store/actions/commun/proposal';
import { openConfirmDialog } from 'store/actions/modals/confirm';
import { currentUserIdSelector } from 'store/selectors/auth';
import { extendedProposalSelector } from 'store/selectors/common';

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
