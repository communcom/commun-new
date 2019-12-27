import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedPostType, proposalType } from 'types';

import CardFooterDecision from 'components/leaderBoard/CardFooterDecision';
import AsyncButton from 'components/common/AsyncButton';
import ReportList from 'components/common/ReportList';

const Wrapper = styled.div``;

const ProposalControls = styled.div`
  display: flex;
  align-items: center;
`;

const ApprovesCount = styled.span`
  margin: 0 10px 2px 0;
  font-size: 14px;
`;

export default class PostCardReports extends Component {
  static propTypes = {
    post: extendedPostType.isRequired,
    proposal: proposalType,

    fetchProposal: PropTypes.func.isRequired,
    createAndApproveBanPostProposal: PropTypes.func.isRequired,
    approveProposal: PropTypes.func.isRequired,
    execProposal: PropTypes.func.isRequired,
    cancelProposalApprove: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    proposal: null,
  };

  state = {
    forceProcessing: false,
  };

  onCreateProposalClick = async () => {
    const { post, createAndApproveBanPostProposal, fetchProposal, waitForTransaction } = this.props;

    const result = await createAndApproveBanPostProposal(post.contentId);

    try {
      await waitForTransaction(result.transaction_id);
      await fetchProposal(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed:', err);
    }
  };

  onRefuseClick = async () => {
    const { proposal, cancelProposalApprove } = this.props;

    this.setState({
      forceProcessing: true,
    });

    try {
      await cancelProposalApprove(proposal.contentId);
    } finally {
      this.setState({
        forceProcessing: false,
      });
    }
  };

  onApproveBanClick = async () => {
    const { proposal, approveProposal } = this.props;
    await approveProposal(proposal.contentId);
  };

  onBanClick = async () => {
    const { proposal, approveProposal, execProposal } = this.props;

    this.setState({
      forceProcessing: true,
    });

    try {
      await approveProposal(proposal.contentId);
      await execProposal(proposal.contentId);
    } finally {
      this.setState({
        forceProcessing: false,
      });
    }
  };

  renderActions() {
    const { proposal } = this.props;
    const { forceProcessing } = this.state;

    if (proposal) {
      const { approvesCount, approvesNeed, isApproved } = proposal;
      const allowExec = !isApproved && approvesCount + 2 >= approvesNeed;

      let button;

      if (isApproved) {
        button = (
          <AsyncButton isProcessing={forceProcessing} onClick={this.onRefuseClick}>
            Refuse Ban
          </AsyncButton>
        );
      } else if (allowExec) {
        button = (
          <AsyncButton isProcessing={forceProcessing} onClick={this.onBanClick}>
            Apply Ban
          </AsyncButton>
        );
      } else {
        button = (
          <AsyncButton isProcessing={forceProcessing} onClick={this.onApproveBanClick}>
            Approve Ban
          </AsyncButton>
        );
      }

      return (
        <ProposalControls>
          <ApprovesCount>
            Approves: {approvesCount}/{approvesNeed}
          </ApprovesCount>
          {button}
        </ProposalControls>
      );
    }

    return (
      <AsyncButton isProcessing={forceProcessing} onClick={this.onCreateProposalClick}>
        Create Ban Proposal
      </AsyncButton>
    );
  }

  render() {
    const { post } = this.props;

    return (
      <Wrapper>
        <ReportList post={post} />
        <CardFooterDecision
          title="Reports"
          text={`${post.reports?.reportsCount || 0}`}
          actions={() => this.renderActions()}
        />
      </Wrapper>
    );
  }
}
