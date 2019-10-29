import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import { KEY_CODES } from '@commun/ui';
import { forwardRef } from 'utils/hocs';
import { checkPressedKey } from 'utils/keyPress';

const Wrapper = styled.div`
  width: 400px;
  height: 331px;
  padding: 5px 20px 20px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 22px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DialogHeader = styled.div`
  padding: 10px 0;
  font-weight: bold;
  font-size: 32px;
  line-height: 44px;

  text-align: center;
  color: #000000;
`;

const DialogText = styled.p`
  margin-top: 22px;
  margin-bottom: 16px;
  font-weight: normal;
  font-size: 17px;
  line-height: 25px;

  text-align: center;
  color: #000000;
`;

const Button = styled.button.attrs({ type: 'button' })`
  padding: 7px 16px 9px;
  border-radius: 8px;
  white-space: nowrap;
  transition: color 0.15s, background-color 0.15s;
  height: 50px;

  font-weight: bold;
  line-height: 20px;

  text-align: center;

  ${({ theme, isPrimary }) =>
    isPrimary
      ? `
      width: 288px;
      border-radius: 8px;
      height: 50px;
      font-size: 16px;
      color: #fff;
      background-color: ${theme.colors.lightRed};
    `
      : `
      font-size: 17px;
      margin-top: 10px;
      color: ${theme.colors.blue};
      background-color: transparent;

      &:hover,
      &:focus {
        color: ${rgba(theme.colors.blue, 0.8)};
      }
    `};
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;
  margin-top: 35px;
`;

@forwardRef('modalRef')
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
    close(true);
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  onKeyDown = e => {
    const { close } = this.props;
    if (checkPressedKey(e) === KEY_CODES.ESC) {
      close();
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
