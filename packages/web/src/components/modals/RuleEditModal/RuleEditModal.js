/* eslint-disable react/destructuring-assignment */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input, DialogButton } from '@commun/ui';
import { withTranslation } from 'shared/i18n';
import { applyRef } from 'utils/hocs';
import { displaySuccess } from 'utils/toastsMessages';
import AsyncAction from 'components/common/AsyncAction';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const Wrapper = styled.div`
  flex-basis: 500px;
  padding: 20px;
  border-radius: 15px;
  background: #fff;
`;

const RuleHeader = styled.h2`
  margin-bottom: 18px;
  font-size: 18px;
`;

const Field = styled.div`
  margin: 10px 0;
`;

const InputStyled = styled(Input)`
  width: 100%;
`;

const RuleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

function createRuleId() {
  const id = [];

  for (let i = 0; i < 8; i += 1) {
    id.push(ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length)));
  }

  return id.join('');
}

@withTranslation()
@applyRef('modalRef')
export default class RuleEditModal extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    isNewRule: PropTypes.bool,
    rule: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    isCommunityCreation: PropTypes.bool,

    setRule: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    updateCommunityRules: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: '',
    isNewRule: false,
    isCommunityCreation: false,
    rule: null,
  };

  constructor(props) {
    super(props);

    const { rule } = this.props;

    this.state = {
      title: rule ? rule.title : '',
      text: rule ? rule.text : '',
    };
  }

  onTitleChange = e => {
    this.setState({
      title: e.target.value,
    });
  };

  onTextChange = e => {
    this.setState({
      text: e.target.value,
    });
  };

  onCreateProposalClick = async () => {
    const {
      communityId,
      rule,
      isNewRule,
      setRule,
      close,
      updateCommunityRules,
      isCommunityCreation,
      t,
    } = this.props;
    let { title, text } = this.state;

    title = title.trim();
    text = text.trim();

    let action;

    if (isNewRule) {
      action = {
        type: 'add',
        data: {
          id: createRuleId(),
          title,
          text,
        },
      };
    } else {
      const data = {
        id: rule.id,
      };

      if (rule.title !== title) {
        data.title = title;
      }

      if (rule.text !== text) {
        data.text = text;
      }

      action = {
        type: 'update',
        data,
      };
    }

    if (isCommunityCreation) {
      setRule(action);
    } else {
      await updateCommunityRules({
        communityId,
        action,
      });
      displaySuccess(t('modals.rule_edit.toastsMessages.created'));
    }

    close();
  };

  onCancelClick = async () => {
    if (await this.canClose()) {
      const { close } = this.props;
      close();
    }
  };

  canClose() {
    const { rule, isNewRule, openConfirmDialog, t } = this.props;
    const { title, text } = this.state;

    if (!title.trim() && !text.trim()) {
      return true;
    }

    if (!isNewRule && rule.title === title && rule.text === text) {
      return true;
    }

    return openConfirmDialog(t('modals.rule_edit.question'));
  }

  render() {
    const { rule, isNewRule, isCommunityCreation, t } = this.props;
    const { title, text } = this.state;

    let disabled = false;

    const tTitle = title.trim();
    const tText = text.trim();

    if (!tTitle || !tText) {
      disabled = true;
    } else if (!isNewRule) {
      disabled = rule.title === title.trim() && rule.text === text.trim();
    }

    return (
      <Wrapper>
        <RuleHeader>
          {isNewRule ? t('modals.rule_edit.title') : t('modals.rule_edit.title-edit')}
        </RuleHeader>
        <Field>
          <InputStyled
            title={t('modals.rule_edit.title_field')}
            value={title}
            onChange={this.onTitleChange}
          />
        </Field>
        <Field>
          <InputStyled
            title={t('modals.rule_edit.description_field')}
            multiline
            allowResize
            value={text}
            onChange={this.onTextChange}
          />
        </Field>
        <RuleFooter>
          <DialogButton onClick={this.onCancelClick}>{t('common.cancel')}</DialogButton>
          <AsyncAction onClickHandler={disabled ? null : this.onCreateProposalClick}>
            <DialogButton primary disabled={disabled}>
              {isCommunityCreation ? t('common.save') : t('modals.rule_edit.submit')}
            </DialogButton>
          </AsyncAction>
        </RuleFooter>
      </Wrapper>
    );
  }
}
