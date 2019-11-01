import { connect } from 'react-redux';

import { extendedProposalSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { approveProposal, cancelProposalApprove } from 'store/actions/commun/proposal';

import ProposalCard from './ProposalCard';

export default connect(
  (state, props) => ({
    userId: currentUserIdSelector(state),
    proposal: extendedProposalSelector(props.proposalId)(state),
  }),
  {
    approveProposal,
    cancelProposalApprove,
  }
)(ProposalCard);
