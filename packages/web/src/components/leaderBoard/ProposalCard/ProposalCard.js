import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Card, Button } from '@commun/ui';
import { proposalType } from 'types';

import CardCommunityHeader from 'components/common/CardCommunityHeader';

const Wrapper = styled(Card)`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Content = styled.div`
  padding: 15px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.background};
`;

const ProposalFooter = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 15px;
`;

const FooterText = styled.div`
  flex-grow: 1;
`;

const FooterTitle = styled.div`
  margin-bottom: 2px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const FooterVoted = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const FooterButtons = styled.div`
  flex-shrink: 0;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const TextBlock = styled.div``;

const ChangeTitle = styled.div`
  display: flex;
  align-items: center;
`;

const ChangeTitleText = styled.h2`
  flex-grow: 1;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
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

const RuleTitle = styled.h3``;

const RuleText = styled.p``;

// eslint-disable-next-line react/prop-types
function Rule({ data }) {
  return (
    <>
      <RuleTitle>{data.title}</RuleTitle>
      <RuleText>{data.text}</RuleText>
    </>
  );
}

export default class ProposalCard extends PureComponent {
  static propTypes = {
    proposal: proposalType.isRequired,
  };

  state = {
    isShowOld: false,
  };

  onToggleOldClick = () => {
    const { isShowOld } = this.state;

    this.setState({
      isShowOld: !isShowOld,
    });
  };

  renderRules(changes) {
    const { isShowOld } = this.state;

    switch (changes.subType) {
      case 'add':
        return (
          <TextBlock>
            <ChangeTitle>
              <ChangeTitleText>Add rule</ChangeTitleText>
            </ChangeTitle>
            <Rule data={changes.new} />
          </TextBlock>
        );

      case 'update':
        return (
          <>
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
          </>
        );

      default:
        // eslint-disable-next-line no-console
        console.log('Not implemented yet changes:', changes);
        return 'Not implemented yet';
    }
  }

  renderContent() {
    const { proposal } = this.props;

    const { contract, action, change } = proposal;

    if (contract === 'c.list' && action === 'setinfo' && change) {
      switch (change.type) {
        case 'rules':
          return this.renderRules(change);

        default:
          return `Proposal type (${change.type}) not implemented yet.`;
      }
    }

    return `Proposal for ${contract}::${action} not implemented yet.`;
  }

  render() {
    const { proposal } = this.props;
    const { community, proposer, approvesCount, blockTime } = proposal;

    return (
      <Wrapper>
        <CardCommunityHeader community={community} user={proposer} time={blockTime} />
        <Content>{this.renderContent()}</Content>
        <ProposalFooter>
          <FooterText>
            <FooterTitle>Voted</FooterTitle>
            <FooterVoted>{approvesCount} from 15 leaders</FooterVoted>
          </FooterText>
          <FooterButtons>
            <Button>Accept</Button>
            <Button>Reject</Button>
          </FooterButtons>
        </ProposalFooter>
      </Wrapper>
    );
  }
}
