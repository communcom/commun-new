import { connect } from 'react-redux';

import { extendedProposalSelector } from 'store/selectors/common';

import ProposalCard from './ProposalCard';

export default connect((state, props) => ({
  proposal: extendedProposalSelector(props.proposalId)(state),
}))(ProposalCard);
