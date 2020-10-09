import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import isEmpty from 'ramda/src/isEmpty';
import mergeAll from 'ramda/src/mergeAll';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, Input } from '@commun/ui';

import { COMMUNITY_CREATION_KEY } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { createRuleId, getDefaultRules } from 'utils/community';
import { getFieldValue, setFieldValue } from 'utils/localStore';
import { displaySuccess } from 'utils/toastsMessages';

import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

const RULE_INDEX_OFFSET = 1;

const Wrapper = styled.main`
  padding-bottom: 30px;

  ${is('isCommunityCreation')`
    border-top: 1px solid #e2e6e8;
  `}
`;

const RulesHeader = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
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
  padding: 20px 0;

  ${is('isCommunityCreation')`
    padding: 15px 0 30px;
    border-bottom: 1px solid #e2e6e8;
  `}

  ${isNot('isCommunityCreation')`
    margin-bottom: 15px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.white};
  `}
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

const RuleEditMobile = styled.div`
  margin-top: 20px;
`;

const RuleEdit = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 15px;

  & label:nth-of-type(1) {
    margin-bottom: 15px;

    & input {
      font-weight: 600;
    }
  }
`;

const RuleEditActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  position: relative;
`;

const RuleId = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: -11px;
  color: ${({ theme }) => theme.colors.black};
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  position: absolute;
  top: -15px;
  right: 0;
`;

const MoreIcon = styled(Icon).attrs({
  name: 'more',
})`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
`;

const DeleteMenuItem = styled(DropDownMenuItem)`
  color: red;
`;

const AddRule = styled.div`
  margin-top: 15px;
  padding-left: 15px;
`;

const AddRuleMobile = styled.div`
  margin: 0 10px;

  ${is('isCommunityCreation')`
    margin: 15px 10px 0;
  `}
`;

const AddRuleMobileButton = styled(Button)`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const PlusIcon = styled(Icon).attrs({ name: 'cross' })`
  display: inline-block;
  width: 12px;
  height: 12px;

  margin-right: 10px;

  transform: rotate(45deg);
  color: ${({ theme, isMobile }) => theme.colors[isMobile ? 'blue' : 'white']};
`;

@withTranslation()
export default class Rules extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    isLeader: PropTypes.bool.isRequired,
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
    language: PropTypes.object,
    isMobile: PropTypes.bool.isRequired,
    isCommunityCreation: PropTypes.bool,

    openRuleEditModal: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    updateCommunityRules: PropTypes.func.isRequired,
    setRule: PropTypes.func.isRequired,
    removeRule: PropTypes.func.isRequired,
    setDefaultRules: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: null,
    language: null,
    isCommunityCreation: false,
  };

  constructor(args) {
    super(args);

    const { isCommunityCreation } = this.props;

    this.state = {
      opened: {},
      hasChanges: false,
      editingRules: isCommunityCreation ? this.getRulesMap() : {},
      isEditing: isCommunityCreation,
      isUpdating: false,
    };
  }

  componentDidMount() {
    const { rules, language, setDefaultRules, isCommunityCreation } = this.props;

    if (
      isCommunityCreation &&
      !rules.length &&
      !getFieldValue(COMMUNITY_CREATION_KEY, 'rules')?.length
    ) {
      setDefaultRules(getDefaultRules(language));
    }
  }

  componentDidUpdate(prevProps) {
    const { rules, isCommunityCreation } = this.props;

    if (isCommunityCreation && !equals(rules, prevProps.rules)) {
      setFieldValue(COMMUNITY_CREATION_KEY, 'rules', rules);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editingRules: this.getRulesMap() });
    }
  }

  getChangedRules = rules => Object.values(rules).filter(r => !isEmpty(r.changes));

  getRulesMap = () => {
    const { rules } = this.props;

    return mergeAll(
      rules.map(rule => ({
        [rule.id]: { ...rule, original_title: rule.title, original_text: rule.text, changes: {} },
      }))
    );
  };

  prepareAction = rule => {
    const title = rule.title.trim();
    const text = rule.text.trim();

    if (rule.changes.newRule) {
      return {
        type: 'add',
        data: {
          id: createRuleId(),
          title,
          text,
        },
      };
    }
    const data = {
      id: rule.id,
    };

    if (rule.changes.title) {
      data.title = title;
    }

    if (rule.changes.text) {
      data.text = text;
    }

    return {
      type: 'update',
      data,
    };
  };

  // uses in packages/web/src/components/modals/CreateCommunityData/Rules/Rules.js
  onProposalsClick = async () => {
    const { communityId, updateCommunityRules, t } = this.props;

    const { editingRules } = this.state;

    this.setState({
      isUpdating: true,
    });

    for await (const rule of this.getChangedRules(editingRules)) {
      const action = this.prepareAction(rule);

      await updateCommunityRules({
        communityId,
        action,
      });
      displaySuccess(t('modals.rule_edit.toastsMessages.created'));
    }

    this.clearState();
  };

  checkChanges = () => {
    const { editingRules } = this.state;
    const changesCount = this.getChangedRules(editingRules).length;

    this.setState({
      hasChanges: changesCount > 0,
    });
  };

  onEditActiveClick = () => {
    this.setState(state => ({
      isEditing: !state.isEditing,
      editingRules: this.getRulesMap(),
    }));
  };

  clearState = () => {
    this.setState({
      isEditing: false,
      editingRules: {},
      isUpdating: false,
    });
  };

  onMobileNewRuleClick = () => {
    const { communityId, isCommunityCreation, openRuleEditModal } = this.props;
    openRuleEditModal({ communityId, isCommunityCreation, isNewRule: true });
  };

  onNewRuleClick = () => {
    const { editingRules } = this.state;

    const ruleId = createRuleId();

    const newRule = {
      id: ruleId,
      title: '',
      text: '',
      changes: {
        title: true,
        text: true,
        newRule: true,
      },
    };

    this.setState(
      state => ({
        isEditing: state.isEditing || true,
        editingRules: {
          ...(!isEmpty(editingRules) ? editingRules : this.getRulesMap()),
          [ruleId]: newRule,
        },
      }),
      () => {
        this.checkChanges();
      }
    );
  };

  onRemoveRuleClick = async rule => {
    const {
      communityId,
      isCommunityCreation,
      openConfirmDialog,
      updateCommunityRules,
      removeRule,
      t,
    } = this.props;
    const { editingRules } = this.state;

    if (rule.changes && rule.changes.newRule) {
      delete editingRules[rule.id];

      this.setState(
        {
          editingRules: {
            ...editingRules,
          },
        },
        () => {
          this.checkChanges();
        }
      );

      return;
    }

    if (isCommunityCreation) {
      removeRule(rule.id);
    } else {
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
    }
  };

  onEditItemClick = rule => {
    const { communityId, isCommunityCreation, openRuleEditModal } = this.props;
    openRuleEditModal({ communityId, isCommunityCreation, rule });
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

  onRuleBlur = async () => {
    const { isCommunityCreation, setRule } = this.props;
    const { editingRules } = this.state;

    if (isCommunityCreation) {
      for await (const rule of this.getChangedRules(editingRules)) {
        const action = this.prepareAction(rule);

        setRule(action);
      }
    }
  };

  onRuleChange = (ruleId, type) => e => {
    const { editingRules } = this.state;

    const { value } = e.target;

    const rule = editingRules[ruleId];

    if (type === 'text') {
      rule.text = value;
    } else {
      rule.title = value;
    }

    const isValueChanged = value !== rule[`original_${type}`];

    if (isValueChanged) {
      rule.changes[type] = isValueChanged;
    } else {
      delete rule.changes[type];
    }

    this.setState(
      {
        editingRules: {
          ...editingRules,
          [ruleId]: rule,
        },
      },
      () => {
        this.checkChanges();
      }
    );
  };

  renderLeaderButtons = () => {
    const { isMobile, t } = this.props;
    const { isEditing, hasChanges, isUpdating } = this.state;

    if (isMobile) {
      return null;
    }

    return (
      <LeaderButtons>
        {isEditing ? (
          <>
            <Button small onClick={this.clearState}>
              {t('common.cancel')}
            </Button>
            <Button
              primary
              small
              disabled={!hasChanges || isUpdating}
              onClick={this.onProposalsClick}
            >
              {t('components.leaderboard.settings.buttons.save')}
            </Button>
          </>
        ) : (
          <>
            <EditRuleButton primary={!isEditing} small onClick={this.onEditActiveClick}>
              {t('common.edit')}
            </EditRuleButton>
            <Button small primary onClick={this.onNewRuleClick}>
              {t('components.community.rules.new_rule')}
            </Button>
          </>
        )}
      </LeaderButtons>
    );
  };

  renderItem(rule, i) {
    const { isLeader, isMobile, isCommunityCreation, t } = this.props;
    const { opened, isEditing } = this.state;

    const isOpen = Boolean(opened[rule.id]);

    return (
      <RuleItem key={rule.id} isCommunityCreation={isCommunityCreation}>
        {isLeader && isEditing ? (
          <RuleEdit>
            <RuleEditActions>
              <RuleId>{`#${i + RULE_INDEX_OFFSET} ${t(
                'components.leaderboard.settings.placeholders.rule'
              )}`}</RuleId>
              <DropDownMenuStyled
                align="right"
                handler={props => (
                  <Action {...props}>
                    <MoreIcon />
                  </Action>
                )}
                items={() => (
                  <DeleteMenuItem
                    name="rules__delete"
                    onClick={() => {
                      this.onRemoveRuleClick(rule);
                    }}
                  >
                    {t('common.delete')}
                  </DeleteMenuItem>
                )}
              />
            </RuleEditActions>
            <Input
              type="text"
              title={t('components.leaderboard.settings.placeholders.rule_name')}
              value={rule.title}
              onBlur={this.onRuleBlur}
              onChange={this.onRuleChange(rule.id, 'title')}
            />
            <Input
              type="text"
              title={t('components.leaderboard.settings.placeholders.description')}
              value={rule.text}
              multiline
              onBlur={this.onRuleBlur}
              onChange={this.onRuleChange(rule.id, 'text')}
            />
          </RuleEdit>
        ) : (
          <>
            <RuleTitle>
              <RuleTitleText isOpen={isOpen}>
                {i + RULE_INDEX_OFFSET}. {rule.title}
              </RuleTitleText>
              <CollapseButton onClick={() => this.onCollapseClick(rule.id)}>
                <CollapseIcon isOpen={isOpen} />
              </CollapseButton>
            </RuleTitle>
            {isOpen ? (
              <>
                <RuleFullText>{rule.text}</RuleFullText>
                {isMobile && (
                  <RuleEditMobile>
                    <EditRuleButton primary small onClick={() => this.onEditItemClick(rule)}>
                      {t('common.edit')}
                    </EditRuleButton>
                    <EditRuleButton small onClick={() => this.onRemoveRuleClick(rule)}>
                      {t('common.remove')}
                    </EditRuleButton>
                  </RuleEditMobile>
                )}
              </>
            ) : null}
          </>
        )}
      </RuleItem>
    );
  }

  render() {
    const { isLeader, rules, isMobile, isCommunityCreation, t } = this.props;
    const { isEditing, editingRules } = this.state;

    if (!Array.isArray(rules)) {
      return t('components.community.rules.invalid_format');
    }

    const rulesArray = isEditing ? Object.values(editingRules) : rules;

    return (
      <Wrapper isCommunityCreation={isCommunityCreation}>
        {isLeader && !isCommunityCreation ? (
          <RulesHeader>
            <Title>
              {t('components.community.rules.title')}: <RulesCount>{rules.length}</RulesCount>
            </Title>
            {this.renderLeaderButtons()}
          </RulesHeader>
        ) : null}
        <RulesList>{rulesArray.map((rule, i) => this.renderItem(rule, i))}</RulesList>
        {isEditing && !isMobile ? (
          <AddRule>
            <Button primary medium onClick={this.onNewRuleClick}>
              <PlusIcon />
              {t('components.leaderboard.settings.buttons.add_rule')}
            </Button>
          </AddRule>
        ) : null}
        {isLeader && isMobile ? (
          <AddRuleMobile isCommunityCreation={isCommunityCreation}>
            <AddRuleMobileButton medium onClick={this.onMobileNewRuleClick}>
              <PlusIcon isMobile={isMobile} />
              {t('components.leaderboard.settings.buttons.add_rule')}
            </AddRuleMobileButton>
          </AddRuleMobile>
        ) : null}
      </Wrapper>
    );
  }
}
