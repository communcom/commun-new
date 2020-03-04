import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';

import { Icon } from '@commun/icons';
import { Card, Button, Loader } from '@commun/ui';
import { proposalType } from 'types';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import CardFooterDecision from 'components/leaderBoard/CardFooterDecision';
import CardCommunityHeader from 'components/common/CardCommunityHeader';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import SplashLoader from 'components/common/SplashLoader';

import AvatarChange from './AvatarChange';
import CoverChange from './CoverChange';
import BanEntity from './BanEntity';

const Wrapper = styled(Card)`
  position: relative;
  padding-bottom: 5px;

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

const LoaderStyled = styled(Loader)`
  margin-right: 10px;
`;

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

  onExecClick = async () => {
    this.setState({
      isUpdating: true,
    });

    try {
      await this.execProposal();
      displaySuccess('Proposal applied');
    } catch (err) {
      displayError(err);
    }

    if (!this.unmount) {
      this.setState({
        isUpdating: false,
      });
    }
  };

  onApproveClick = async execAfterApprove => {
    const { proposal, approveProposal } = this.props;

    this.setState({
      isUpdating: true,
    });

    try {
      await approveProposal(proposal.contentId);

      if (execAfterApprove) {
        await this.execProposal();
        displaySuccess('Proposal applied');
      } else {
        displaySuccess('Approved');
      }
    } catch (err) {
      displayError(err);
    }

    if (!this.unmount) {
      this.setState({
        isUpdating: false,
      });
    }
  };

  onRejectClick = async () => {
    const { proposal, cancelProposalApprove } = this.props;

    this.setState({
      isUpdating: true,
    });

    try {
      await cancelProposalApprove(proposal.contentId);
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }

    if (!this.unmount) {
      this.setState({
        isUpdating: false,
      });
    }
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

  async execProposal() {
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

  renderBanEntity() {
    const { proposal } = this.props;
    const { permlink } = proposal.data.message_id;
    // TODO: string check should be removed when back will be ready
    const isComment =
      proposal?.contentType === 'comment' || (permlink && permlink.startsWith('re-'));

    return (
      <ChangesBlock>
        <TextBlock>
          <ChangeTitle>
            <ChangeTitleText>{`Ban ${isComment ? 'comment' : 'post'}:`}</ChangeTitleText>
          </ChangeTitle>
          <BanEntity proposal={proposal} />
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
      return this.renderBanEntity();
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

    const isAllowExec = approvesCount + (isApproved ? 0 : 1) >= approvesNeed;

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
          actions={() => {
            if (isUpdating || isDeleting) {
              return <LoaderStyled />;
            }

            if (isApproved) {
              return (
                <>
                  <Button onClick={this.onRejectClick}>Refuse</Button>
                  {isAllowExec ? (
                    <Button primary onClick={this.onExecClick}>
                      Apply
                    </Button>
                  ) : null}
                </>
              );
            }

            return (
              <Button primary onClick={() => this.onApproveClick(isAllowExec)}>
                {isAllowExec ? 'Accept and apply' : 'Accept'}
              </Button>
            );
          }}
        />
      </Wrapper>
    );
  }
}
