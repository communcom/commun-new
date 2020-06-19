import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

import { COMMUNITY_CREATION_KEY } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { getDefaultRules } from 'utils/community';
import { getFieldValue, setFieldValue } from 'utils/localStore';

const WrapperStyled = styled.main``;

const RulesHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
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
  padding: 15px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
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
  margin-top: 10px;
  font-size: 15px;
  line-height: 22px;
  white-space: pre-wrap;
`;

@withTranslation()
export default class CreateRules extends PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
    language: PropTypes.object,

    openRuleEditModal: PropTypes.func.isRequired,
    removeRule: PropTypes.func.isRequired,
    setDefaultRules: PropTypes.func.isRequired,
  };

  static defaultProps = {
    language: null,
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

  componentDidMount() {
    const { rules, language, setDefaultRules } = this.props;

    if (!rules.length && !getFieldValue(COMMUNITY_CREATION_KEY, 'rules')?.length) {
      setDefaultRules(getDefaultRules(language));
    }
  }

  componentDidUpdate(prevProps) {
    const { rules } = this.props;

    if (!equals(rules, prevProps.rules)) {
      setFieldValue(COMMUNITY_CREATION_KEY, 'rules', rules);
    }
  }

  onNewRuleClick = () => {
    const { openRuleEditModal } = this.props;
    openRuleEditModal({ isCommunityCreation: true, isNewRule: true });
  };

  onEditItemClick = rule => {
    const { openRuleEditModal } = this.props;
    openRuleEditModal({ rule, isCommunityCreation: true });
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

  renderLeaderButtons = () => {
    const { t } = this.props;

    return (
      <LeaderButtons>
        <Button small primary onClick={this.onNewRuleClick}>
          {t('components.community.rules.new_rule')}
        </Button>
      </LeaderButtons>
    );
  };

  renderItem(rule, i) {
    const { removeRule, t } = this.props;
    const { opened } = this.state;

    const isOpen = Boolean(opened[rule.id]);

    return (
      <RuleItem key={rule.id}>
        <RuleTitle>
          <RuleTitleText isOpen={isOpen}>
            {i + 1}. {rule.title}
          </RuleTitleText>
          <EditRuleButton primary small onClick={() => removeRule(rule.id)}>
            {t('common.remove')}
          </EditRuleButton>
          <EditRuleButton primary small onClick={() => this.onEditItemClick(rule)}>
            {t('common.edit')}
          </EditRuleButton>
          <CollapseButton onClick={() => this.onCollapseClick(rule)}>
            <CollapseIcon isOpen={isOpen} />
          </CollapseButton>
        </RuleTitle>
        {isOpen ? <RuleFullText>{rule.text}</RuleFullText> : null}
      </RuleItem>
    );
  }

  render() {
    const { rules, t } = this.props;

    if (!Array.isArray(rules)) {
      return t('components.community.rules.invalid_format');
    }

    return (
      <WrapperStyled>
        <RulesHeader>
          <Title>
            {t('components.community.rules.title')}: <RulesCount>{rules.length}</RulesCount>
          </Title>
          {this.renderLeaderButtons()}
        </RulesHeader>
        <RulesList>{rules.map((rule, i) => this.renderItem(rule, i))}</RulesList>
      </WrapperStyled>
    );
  }
}
