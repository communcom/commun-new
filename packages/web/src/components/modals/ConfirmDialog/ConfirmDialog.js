import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { KEY_CODES, DialogButton } from '@commun/ui';
import { forwardRef } from 'utils/hocs';
import { checkPressedKey } from 'utils/keyPress';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-basis: 400px;
  padding: 20px;
  border-radius: 15px;
  background-color: #fff;
`;

const DialogHeader = styled.div`
  padding: 10px 0;
  line-height: 44px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #000;
`;

const DialogText = styled.p`
  margin: 10px 0 30px;
  font-size: 16px;
  line-height: 24px;

  text-align: center;
  color: #000;
`;

const Buttons = styled.div`
  width: 288px;

  & > * {
    display: block;
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
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
          <DialogButton autoFocus warning name="modal__confirm" onClick={this.onOkClick}>
            {params.confirmText}
          </DialogButton>
          <DialogButton text name="modal__cancel" onClick={this.onCancelClick}>
            Cancel
          </DialogButton>
        </Buttons>
      </Wrapper>
    );
  }
}
