/* eslint-disable react/destructuring-assignment */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input, DialogButton } from '@commun/ui';
import { forwardRef } from 'utils/hocs';
import AsyncAction from 'components/common/AsyncAction';
import { displaySuccess } from 'utils/toastsMessages';

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

@forwardRef('modalRef')
export default class RuleEditModal extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isNewRule: PropTypes.bool,
    rule: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    openConfirmDialog: PropTypes.func.isRequired,
    setCommunityInfo: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isNewRule: false,
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
    const { communityId, rule, isNewRule, close, setCommunityInfo } = this.props;
    let { title, text } = this.state;

    title = title.trim();
    text = text.trim();

    let action;

    if (isNewRule) {
      action = {
        action: 'add',
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
        action: 'update',
        data,
      };
    }

    await setCommunityInfo({
      communityId,
      updates: {
        rules: JSON.stringify([action]),
      },
    });

    displaySuccess('Proposal created');

    close();
  };

  onCancelClick = async () => {
    if (await this.canClose()) {
      const { close } = this.props;
      close();
    }
  };

  canClose() {
    const { rule, isNewRule, openConfirmDialog } = this.props;
    const { title, text } = this.state;

    if (!title.trim() && !text.trim()) {
      return true;
    }

    if (!isNewRule && rule.title === title && rule.text === text) {
      return true;
    }

    return openConfirmDialog('Changes will be lost, continue?');
  }

  render() {
    const { rule, isNewRule } = this.props;
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
        <RuleHeader>{isNewRule ? 'Add rule' : 'Rule editing'}</RuleHeader>
        <Field>
          <InputStyled title="Title" value={title} onChange={this.onTitleChange} />
        </Field>
        <Field>
          <InputStyled
            title="Description"
            multiline
            allowResize
            value={text}
            onChange={this.onTextChange}
          />
        </Field>
        <RuleFooter>
          <DialogButton onClick={this.onCancelClick}>Cancel</DialogButton>
          <AsyncAction onClickHandler={disabled ? null : this.onCreateProposalClick}>
            <DialogButton primary disabled={disabled}>
              Create proposal
            </DialogButton>
          </AsyncAction>
        </RuleFooter>
      </Wrapper>
    );
  }
}
