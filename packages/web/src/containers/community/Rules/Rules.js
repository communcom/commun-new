import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { createRuleId } from 'utils/community';
import { displaySuccess } from 'utils/toastsMessages';

import ChooseLanguage from 'containers/createCommunity/CreateDescription/ChooseLanguage';

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
  padding: 15px 0;
  margin-bottom: 8px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
`;

const RuleTitle = styled.div`
  display: flex;
  min-height: 30px;
  padding: 0 15px;
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
    color: ${({ theme }) => theme.colors.white};
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
  padding: 0 15px;
  font-size: 15px;
  line-height: 22px;
  white-space: pre-wrap;
`;

const RuleLanguage = styled.div`
  margin-top: 10px;
  margin-bottom: -6px;
`;

@withTranslation()
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
    language: PropTypes.string.isRequired,

    openRuleEditModal: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    openCommunityLanguageEditModal: PropTypes.func.isRequired,
    updateCommunityRules: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      opened: {
        language: true,
      },
    };
  }

  state = {
    opened: {},
    isEditing: false,
  };

  onProposalsClick = () => {
    // TODO:
    // eslint-disable-next-line no-undef,no-alert
    alert('Not ready yet');
  };

  onEditActiveClick = () => {
    this.setState(state => ({
      isEditing: !state.isEditing,
    }));
  };

  onNewRuleClick = () => {
    const { communityId, openRuleEditModal } = this.props;
    openRuleEditModal({ communityId, isNewRule: true });
  };

  onEditLanguageClick = () => {
    const { communityId, openCommunityLanguageEditModal } = this.props;
    openCommunityLanguageEditModal({ communityId });
  };

  onRemoveRuleClick = async rule => {
    const { communityId, openConfirmDialog, updateCommunityRules, t } = this.props;

    if (!(await openConfirmDialog(t('components.community.rules.remove_rule_question')))) {
      return;
    }

    const action = {
      type: 'remove',
      data: {
        id: rule.id,
      },
    };

    await updateCommunityRules({
      communityId,
      action,
    });

    displaySuccess(t('components.community.rules.toastsMessages.created'));
  };

  onEditItemClick = rule => {
    const { communityId, openRuleEditModal } = this.props;
    openRuleEditModal({ communityId, rule });
  };

  onCollapseClick = key => {
    const { opened } = this.state;

    this.setState({
      opened: {
        ...opened,
        [key]: !opened[key],
      },
    });
  };

  renderLeaderButtons = () => {
    const { t } = this.props;
    const { isEditing } = this.state;

    return (
      <LeaderButtons>
        {/* <Button small onClick={this.onProposalsClick}> */}
        {/*  10 new proposals */}
        {/* </Button> */}
        <EditRuleButton primary={!isEditing} small onClick={() => this.onEditActiveClick()}>
          {t('common.edit')}
        </EditRuleButton>
        <Button small primary onClick={this.onNewRuleClick}>
          {t('components.community.rules.new_rule')}
        </Button>
      </LeaderButtons>
    );
  };

  renderLanguage() {
    const { isLeader, language, t } = this.props;
    const { opened, isEditing } = this.state;

    const isOpen = Boolean(opened.language);

    return (
      <RuleItem>
        <RuleTitle>
          <RuleTitleText isOpen={isOpen}>
            1. {t('components.community.rules.language', { lng: language.code.toLowerCase() })}
          </RuleTitleText>
          {isLeader && isEditing ? (
            <EditRuleButton primary small onClick={() => this.onEditLanguageClick()}>
              {t('common.edit')}
            </EditRuleButton>
          ) : null}
          <CollapseButton onClick={() => this.onCollapseClick('language')}>
            <CollapseIcon isOpen={isOpen} />
          </CollapseButton>
        </RuleTitle>
        {isOpen ? (
          <RuleLanguage>
            <ChooseLanguage language={language} readOnly />
          </RuleLanguage>
        ) : null}
      </RuleItem>
    );
  }

  renderItem(rule, i) {
    const { isLeader, t } = this.props;
    const { opened, isEditing } = this.state;

    const isOpen = Boolean(opened[rule.id]);

    return (
      <RuleItem key={rule.id}>
        <RuleTitle>
          <RuleTitleText isOpen={isOpen}>
            {i + 2}. {rule.title}
          </RuleTitleText>
          {isLeader && isEditing ? (
            <>
              <EditRuleButton small onClick={() => this.onRemoveRuleClick(rule)}>
                {t('common.remove')}
              </EditRuleButton>
              <EditRuleButton primary small onClick={() => this.onEditItemClick(rule)}>
                {t('common.edit')}
              </EditRuleButton>
            </>
          ) : null}
          <CollapseButton onClick={() => this.onCollapseClick(rule.id)}>
            <CollapseIcon isOpen={isOpen} />
          </CollapseButton>
        </RuleTitle>
        {isOpen ? <RuleFullText>{rule.text}</RuleFullText> : null}
      </RuleItem>
    );
  }

  render() {
    const { isLeader, rules, t } = this.props;

    if (!Array.isArray(rules)) {
      return t('components.community.rules.invalid_format');
    }

    return (
      <WrapperStyled>
        {isLeader ? (
          <RulesHeader>
            <Title>
              {t('components.community.rules.title')}: <RulesCount>{rules.length}</RulesCount>
            </Title>
            {this.renderLeaderButtons()}
          </RulesHeader>
        ) : null}
        <RulesList>
          {this.renderLanguage()}

          {rules.map((rule, i) => this.renderItem(rule, i))}
        </RulesList>
      </WrapperStyled>
    );
  }
}
