import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';

import { Icon } from '@commun/icons';
import { Card } from '@commun/ui';
import { proposalType } from 'types';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import CardFooterDecision from 'components/leaderBoard/CardFooterDecision';
import CardCommunityHeader from 'components/common/CardCommunityHeader';
import AsyncButton from 'components/common/AsyncButton/AsyncButton';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import SplashLoader from 'components/common/SplashLoader';

import AvatarChange from './AvatarChange';
import CoverChange from './CoverChange';
import BanPost from './BanPost';

const Wrapper = styled(Card)`
  position: relative;

  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

const Content = styled.div`
  padding: 15px;
`;

const ChangesBlock = styled.div``;

const TextBlock = styled.div`
  &:not(:first-child) {
    margin-top: 30px;
  }
`;

const ChangeTitle = styled.div`
  display: flex;
  align-items: center;
  min-height: 24px;
  margin-bottom: 5px;
`;

const ChangeTitleText = styled.h2`
  flex-grow: 1;
  line-height: 1;
  font-size: 14px;

  ${is('warning')`
    color: ${({ theme }) => theme.colors.red};
  `};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ToggleIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  transform: rotate(0);
  transition: transform 0.1s;

  ${is('toggled')`
    transform: rotate(0.5turn);
  `};
`;

const RuleBlock = styled.div`
  margin-top: 15px;
`;

const RuleTitle = styled.h3`
  font-size: 16px;
`;

const RuleText = styled.p`
  margin-top: 8px;
`;

const DescriptionText = styled.p``;

/* eslint-disable react/prop-types */
function Rule({ data }) {
  return (
    <RuleBlock>
      <RuleTitle>{data.title}</RuleTitle>
      {data.text ? <RuleText>{data.text}</RuleText> : null}
    </RuleBlock>
  );
}
/* eslint-enable */

export default class ProposalCard extends PureComponent {
  static propTypes = {
    proposal: proposalType.isRequired,
    userId: PropTypes.string,

    approveProposal: PropTypes.func.isRequired,
    execProposal: PropTypes.func.isRequired,
    cancelProposalApprove: PropTypes.func.isRequired,
    cancelProposal: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: null,
  };

  state = {
    isShowOld: false,
    isUpdating: false,
    isDeleting: false,
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  onToggleOldClick = () => {
    const { isShowOld } = this.state;

    this.setState({
      isShowOld: !isShowOld,
    });
  };

  onApproveClick = async execAfterApprove => {
    const { proposal, approveProposal } = this.props;

    this.setState({
      isUpdating: true,
    });

    try {
      await approveProposal(proposal.contentId);

      if (execAfterApprove) {
        await this.tryExec();
        displaySuccess('Proposal applied');
      } else {
        displaySuccess('Approved');
      }
    } finally {
      if (!this.unmount) {
        this.setState({
          isUpdating: false,
        });
      }
    }
  };

  onRejectClick = async () => {
    const { proposal, cancelProposalApprove } = this.props;
    await cancelProposalApprove(proposal.contentId);
    displaySuccess('Success');
  };

  onRemoveClick = async () => {
    const { proposal, cancelProposal, openConfirmDialog } = this.props;

    if (!(await openConfirmDialog())) {
      return;
    }

    this.setState({
      isDeleting: true,
    });

    try {
      await cancelProposal(proposal.contentId);
      displaySuccess('Success');
    } catch (err) {
      displayError(err);

      this.setState({
        isDeleting: false,
      });
    }
  };

  async tryExec() {
    const { proposal, execProposal } = this.props;
    await execProposal(proposal.contentId);
  }

  renderDescription(changes) {
    const { isShowOld } = this.state;

    return (
      <ChangesBlock>
        <TextBlock>
          <ChangeTitle>
            <ChangeTitleText>
              {changes.old ? 'Update description' : 'Set description'}
            </ChangeTitleText>
          </ChangeTitle>
          <DescriptionText>{changes.new}</DescriptionText>
        </TextBlock>
        {changes.old ? (
          <TextBlock>
            <ChangeTitle>
              <ChangeTitleText>Old description </ChangeTitleText>
              <ToggleButton onClick={this.onToggleOldClick}>
                <ToggleIcon toggled={isShowOld} />
              </ToggleButton>
            </ChangeTitle>
            {isShowOld ? <DescriptionText>{changes.old}</DescriptionText> : null}
          </TextBlock>
        ) : null}
      </ChangesBlock>
    );
  }

  renderRules(changes) {
    const { isShowOld } = this.state;

    switch (changes.subType) {
      case 'add':
        return (
          <ChangesBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText>Add rule</ChangeTitleText>
              </ChangeTitle>
              <Rule data={changes.new} />
            </TextBlock>
          </ChangesBlock>
        );

      case 'update':
        return (
          <ChangesBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText>Update rule</ChangeTitleText>
              </ChangeTitle>
              <Rule data={changes.new} />
            </TextBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText>Old rule </ChangeTitleText>
                <ToggleButton onClick={this.onToggleOldClick}>
                  <ToggleIcon toggled={isShowOld} />
                </ToggleButton>
              </ChangeTitle>
              {isShowOld ? <Rule data={changes.old} /> : null}
            </TextBlock>
          </ChangesBlock>
        );

      case 'remove':
        return (
          <ChangesBlock>
            <TextBlock>
              <ChangeTitle>
                <ChangeTitleText warning>Remove rule</ChangeTitleText>
              </ChangeTitle>
              <Rule data={changes.old} />
            </TextBlock>
          </ChangesBlock>
        );

      default:
        // eslint-disable-next-line no-console
        console.log('Not implemented yet changes:', changes);
        return 'Not implemented yet';
    }
  }

  renderBanPost() {
    const { proposal } = this.props;

    return (
      <ChangesBlock>
        <TextBlock>
          <ChangeTitle>
            <ChangeTitleText>Ban post:</ChangeTitleText>
          </ChangeTitle>
          <BanPost proposal={proposal} />
        </TextBlock>
      </ChangesBlock>
    );
  }

  renderContent() {
    const { proposal } = this.props;

    const { contract, action, change, type } = proposal;

    if (contract === 'c.list' && action === 'setinfo') {
      if (change) {
        switch (change.type) {
          case 'rules':
            return this.renderRules(change);

          case 'avatarUrl':
            return <AvatarChange change={change} />;

          case 'coverUrl':
            return <CoverChange change={change} />;

          case 'description':
            return this.renderDescription(change);

          default:
            return `Proposal type${change ? ` (${change.type})` : ''} not implemented yet.`;
        }
      } else {
        return 'Nothing is changed';
      }
    }

    if (type === 'banPost') {
      return this.renderBanPost();
    }

    return `Proposal for ${contract}::${action} not implemented yet.`;
  }

  render() {
    const { userId, proposal } = this.props;
    const { isUpdating, isDeleting } = this.state;

    if (!proposal) {
      return null;
    }

    const { community, proposer, approvesCount, approvesNeed, isApproved, blockTime } = proposal;

    const allowExec = approvesCount + 1 >= approvesNeed;

    return (
      <Wrapper>
        {isDeleting ? <SplashLoader /> : null}
        <CardCommunityHeader
          community={community}
          user={proposer}
          time={blockTime}
          menuItems={
            userId && userId === proposer.userId
              ? () => (
                  <DropDownMenuItem isWarning onClick={this.onRemoveClick}>
                    Remove
                  </DropDownMenuItem>
                )
              : null
          }
        />
        <Content>{this.renderContent()}</Content>
        <CardFooterDecision
          title="Voted"
          text={`${approvesCount} from ${approvesNeed} votes`}
          actions={() =>
            isApproved ? (
              <AsyncButton
                isProcessing={isUpdating}
                disabled={isUpdating || isDeleting}
                onClick={this.onRejectClick}
              >
                Refuse
              </AsyncButton>
            ) : (
              <AsyncButton
                primary
                isProcessing={isUpdating}
                disabled={isUpdating || isDeleting}
                onClick={() => this.onApproveClick(allowExec)}
              >
                {allowExec ? 'Accept and apply' : 'Accept'}
              </AsyncButton>
            )
          }
        />
      </Wrapper>
    );
  }
}
