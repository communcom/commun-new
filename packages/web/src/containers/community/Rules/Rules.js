import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

const WrapperStyled = styled.main``;

const RulesHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 6px;
  background: #fff;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  flex-grow: 1;
  font-size: 18px;
  font-weight: bold;
`;

const LeaderButtons = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const RulesCount = styled.span`
  color: ${({ theme }) => theme.colors.gray};
`;

const RulesList = styled.ul``;

const RuleItem = styled.li`
  padding: 15px 15px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: #fff;

  &:not(:last-child) {
    padding: 15px 15px 20px;
  }
`;

const RuleTitle = styled.div`
  display: flex;
`;

const RuleTitleText = styled.span`
  flex-grow: 1;
  margin-top: 3px;
  margin-right: 3px;
  line-height: 22px;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${is('isOpen')`
    white-space: normal;
    text-overflow: normal;
  `};
`;

const EditRuleButton = styled(Button)`
  flex-shrink: 0;
  margin-left: 10px;
`;

const CollapseButton = styled.button`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin: 3px 0 0 10px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow: hidden;

  &:focus,
  &:hover {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blue};
  }
`;

const CollapseIcon = styled(Icon).attrs({ name: 'chevron' })`
  margin-bottom: -2px;
  transform: rotate(0);
  transition: transform 0.1s;

  ${is('isOpen')`
    transform: rotate(0.5turn);
  `};
`;

const RuleFullText = styled.div`
  margin-top: 5px;
  font-size: 15px;
  line-height: 22px;
`;

export default class Rules extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isLeader: PropTypes.bool.isRequired,
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
    openRuleEditModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const opened = {};

    if (props.rules.length) {
      opened[props.rules[0].id] = true;
    }

    this.state = {
      opened,
    };
  }

  onProposalsClick = () => {
    // TODO:
    // eslint-disable-next-line no-undef,no-alert
    alert('Not ready yet');
  };

  onNewRuleClick = () => {
    const { communityId, openRuleEditModal } = this.props;
    openRuleEditModal({ communityId, isNewRule: true });
  };

  onEditItemClick = rule => {
    const { communityId, openRuleEditModal } = this.props;
    openRuleEditModal({ communityId, rule });
  };

  onCollapseClick = rule => {
    const { opened } = this.state;

    this.setState({
      opened: {
        ...opened,
        [rule.id]: !opened[rule.id],
      },
    });
  };

  renderLeaderButtons = () => (
    <LeaderButtons>
      {/* <Button small onClick={this.onProposalsClick}> */}
      {/*  10 new proposals */}
      {/* </Button> */}
      <Button small primary onClick={this.onNewRuleClick}>
        New rule
      </Button>
    </LeaderButtons>
  );

  renderItem(rule, i) {
    const { isLeader } = this.props;
    const { opened } = this.state;

    const isOpen = Boolean(opened[rule.id]);

    return (
      <RuleItem key={rule.id}>
        <RuleTitle>
          <RuleTitleText isOpen={isOpen}>
            {i + 1}. {rule.title}
          </RuleTitleText>
          {isLeader ? (
            <EditRuleButton primary small onClick={() => this.onEditItemClick(rule)}>
              Edit
            </EditRuleButton>
          ) : null}
          <CollapseButton onClick={() => this.onCollapseClick(rule)}>
            <CollapseIcon isOpen={isOpen} />
          </CollapseButton>
        </RuleTitle>
        {isOpen ? <RuleFullText>{rule.text}</RuleFullText> : null}
      </RuleItem>
    );
  }

  render() {
    const { isLeader, rules } = this.props;

    if (!Array.isArray(rules)) {
      return 'Invalid rules format';
    }

    return (
      <WrapperStyled>
        {isLeader ? (
          <RulesHeader>
            <Title>
              Rules: <RulesCount>{rules.length}</RulesCount>
            </Title>
            {this.renderLeaderButtons()}
          </RulesHeader>
        ) : null}
        <RulesList>{rules.map((rule, i) => this.renderItem(rule, i))}</RulesList>
      </WrapperStyled>
    );
  }
}
