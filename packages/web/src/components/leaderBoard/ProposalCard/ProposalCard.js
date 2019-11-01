import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Card } from '@commun/ui';
import { proposalType } from 'types';

import CardCommunityHeader from 'components/common/CardCommunityHeader';
import CardFooterDecision from 'components/leaderBoard/CardFooterDecision';

const Wrapper = styled(Card)`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Content = styled.div`
  padding: 15px;
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
        <CardFooterDecision
          title="Voted"
          text={`${approvesCount} from 15 leaders`}
          onAcceptClick={() => {}}
          onRejectClick={() => {}}
        />
      </Wrapper>
    );
  }
}
