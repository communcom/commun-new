import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import { KEY_CODES } from '@commun/ui';
import { forwardRef } from 'utils/hocs';
import { checkPressedKey } from 'utils/keyPress';

import { MODAL_CONFIRM, MODAL_CANCEL } from 'store/constants/modalTypes';

const Wrapper = styled.div`
  min-width: 220px;
  padding: 5px 20px 20px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 22px rgba(0, 0, 0, 0.1);
`;

const DialogHeader = styled.div`
  padding: 10px 0;
  font-size: 20px;
`;

const DialogText = styled.p`
  margin-bottom: 16px;
`;

const Button = styled.button.attrs({ type: 'button' })`
  padding: 7px 16px 9px;
  border-radius: 8px;
  white-space: nowrap;
  transition: color 0.15s, background-color 0.15s;

  ${({ theme, isPrimary }) =>
    isPrimary
      ? `
      color: #fff;
      background-color: ${theme.colors.contextBlue};

      &:hover,
      &:focus {
        background-color: ${rgba(theme.colors.contextBlue, 0.8)};
      }
    `
      : `
      color: ${theme.colors.contextBlue};
      background-color: transparent;

      &:hover,
      &:focus {
        color: ${rgba(theme.colors.contextBlue, 0.8)};
      }
    `};
`;

const Buttons = styled.div`
  display: flex;

  & > ${Button}:not(:last-child) {
    margin-right: 8px;
  }
`;

@forwardRef()
export default class ConfirmDialog extends Component {
  static propTypes = {
    text: PropTypes.string,
    params: PropTypes.shape({
      confirmText: PropTypes.string,
    }),
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    text: null,
    params: {
      confirmText: 'Ok',
    },
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onOkClick = () => {
    const { close } = this.props;
    close({ status: MODAL_CONFIRM });
  };

  onCancelClick = () => {
    const { close } = this.props;
    close({ status: MODAL_CANCEL });
  };

  onKeyDown = e => {
    const { close } = this.props;
    if (checkPressedKey(e) === KEY_CODES.ESC) {
      close({ status: MODAL_CANCEL });
    }
  };

  render() {
    const { text, params } = this.props;

    return (
      <Wrapper>
        <DialogHeader>Confirmation</DialogHeader>
        <DialogText>{text || 'Are you sure?'}</DialogText>
        <Buttons>
          <Button autoFocus isPrimary name="modal__confirm" onClick={this.onOkClick}>
            {params.confirmText}
          </Button>
          <Button name="modal__cancel" onClick={this.onCancelClick}>
            Cancel
          </Button>
        </Buttons>
      </Wrapper>
    );
  }
}
