import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { extendedCommentType, extendedPostType, proposalType } from 'types';
import { withTranslation } from 'shared/i18n';
import { normalizeCyberwayErrorMessage } from 'utils/errors';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import { LoaderIcon } from 'components/common/AsyncAction';
import AsyncButton from 'components/common/AsyncButton';
import ReportList from 'components/common/ReportList';
import CardFooterDecision from 'components/pages/leaderboard/CardFooterDecision';

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

@withTranslation()
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
    const { entity, proposal, approveProposal, execProposal, removeReport, t } = this.props;

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

    displaySuccess(t('components.entity_card_reports.toastsMessages.post_banned'));
  });

  renderActions() {
    const { proposal, t } = this.props;
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
            {t('components.entity_card_reports.refuse')}
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
            {t('components.entity_card_reports.ban')}
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
            {t('components.entity_card_reports.approve')}
          </AsyncButton>
        );
      }

      return (
        <ProposalControls>
          <ApprovesCount>
            {t('components.entity_card_reports.approves')}: {approvesCount}/{approvesNeed}
          </ApprovesCount>
          <Buttons>{buttons}</Buttons>
        </ProposalControls>
      );
    }

    return (
      <AsyncButton primary onClick={this.onCreateProposalClick}>
        {t('components.entity_card_reports.create')}
      </AsyncButton>
    );
  }

  render() {
    const { entity, t } = this.props;

    return (
      <Wrapper>
        <ReportList entity={entity} />
        <CardFooterDecision
          title={t('components.entity_card_reports.reports')}
          text={`${entity.reports?.reportsCount || 0}`}
          actions={() => this.renderActions()}
        />
      </Wrapper>
    );
  }
}
