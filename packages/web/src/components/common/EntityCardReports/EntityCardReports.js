import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { extendedPostType, proposalType, extendedCommentType } from 'types';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { normalizeCyberwayErrorMessage } from 'utils/errors';

import CardFooterDecision from 'components/leaderBoard/CardFooterDecision';
import AsyncButton from 'components/common/AsyncButton';
import { LoaderIcon } from 'components/common/AsyncAction';
import ReportList from 'components/common/ReportList';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ProposalControls = styled.div`
  display: flex;
  align-items: center;
`;

const ApprovesCount = styled.span`
  margin: 0 10px 2px 0;
  font-size: 14px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 6px;
  }
`;

const LoaderBlock = styled.div`
  padding: 0 10px;
`;

export default class EntityCardReports extends Component {
  static propTypes = {
    entity: PropTypes.oneOfType([extendedPostType, extendedCommentType]).isRequired,
    proposal: proposalType,

    fetchProposal: PropTypes.func.isRequired,
    createAndApproveBanPostProposal: PropTypes.func.isRequired,
    approveProposal: PropTypes.func.isRequired,
    execProposal: PropTypes.func.isRequired,
    cancelProposalApprove: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    removeReport: PropTypes.func.isRequired,
  };

  static defaultProps = {
    proposal: null,
  };

  state = {
    isProcessing: false,
  };

  // eslint-disable-next-line react/sort-comp
  wrapProcess = callback => async (...args) => {
    this.setState({
      isProcessing: true,
    });

    try {
      return await callback.apply(this, args);
    } finally {
      this.setState({
        isProcessing: false,
      });
    }
  };

  onCreateProposalClick = this.wrapProcess(async () => {
    const {
      entity,
      createAndApproveBanPostProposal,
      fetchProposal,
      waitForTransaction,
    } = this.props;

    const result = await createAndApproveBanPostProposal(entity.contentId);

    try {
      await waitForTransaction(result.transaction_id);
      await fetchProposal(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed:', err);
    }
  });

  onRefuseClick = this.wrapProcess(async () => {
    const { proposal, cancelProposalApprove } = this.props;
    await cancelProposalApprove(proposal.contentId);
  });

  onApproveBanClick = this.wrapProcess(async () => {
    const { proposal, approveProposal } = this.props;
    await approveProposal(proposal.contentId);
  });

  onBanClick = this.wrapProcess(async () => {
    const { entity, proposal, approveProposal, execProposal, removeReport } = this.props;

    if (!proposal.isApproved) {
      try {
        await approveProposal(proposal.contentId);
      } catch (err) {
        const errorText = normalizeCyberwayErrorMessage(err);

        if (errorText !== 'already approved') {
          displayError(errorText);
          return;
        }
      }
    }

    await execProposal(proposal.contentId);
    await removeReport(entity.contentId);

    displaySuccess('Post banned');
  });

  renderActions() {
    const { proposal } = this.props;
    const { isProcessing } = this.state;

    if (isProcessing) {
      return (
        <LoaderBlock>
          <LoaderIcon />
        </LoaderBlock>
      );
    }

    if (proposal) {
      const { approvesCount, approvesNeed, isApproved } = proposal;
      const allowExec = approvesCount + (isApproved ? 0 : 1) >= approvesNeed;
      const isLocked = dayjs().isAfter(dayjs(proposal.expiration));

      const buttons = [];

      if (isApproved) {
        buttons.push(
          <AsyncButton key={buttons.length + 1} disabled={isLocked} onClick={this.onRefuseClick}>
            Refuse Ban
          </AsyncButton>
        );
      }

      if (allowExec) {
        buttons.push(
          <AsyncButton
            key={buttons.length + 1}
            danger
            disabled={isLocked}
            onClick={this.onBanClick}
          >
            Ban
          </AsyncButton>
        );
      } else if (!isApproved) {
        buttons.push(
          <AsyncButton
            key={buttons.length + 1}
            primary
            disabled={isLocked}
            onClick={this.onApproveBanClick}
          >
            Approve Ban
          </AsyncButton>
        );
      }

      return (
        <ProposalControls>
          <ApprovesCount>
            Approves: {approvesCount}/{approvesNeed}
          </ApprovesCount>
          <Buttons>{buttons}</Buttons>
        </ProposalControls>
      );
    }

    return (
      <AsyncButton primary onClick={this.onCreateProposalClick}>
        Create Ban Proposal
      </AsyncButton>
    );
  }

  render() {
    const { entity } = this.props;

    return (
      <Wrapper>
        <ReportList entity={entity} />
        <CardFooterDecision
          title="Reports"
          text={`${entity.reports?.reportsCount || 0}`}
          actions={() => this.renderActions()}
        />
      </Wrapper>
    );
  }
}
