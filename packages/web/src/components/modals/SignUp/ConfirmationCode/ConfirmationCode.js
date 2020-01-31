/* stylelint-disable no-descending-specificity,property-no-vendor-prefix */

import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { LoadingRegText, KEY_CODES } from '@commun/ui';
import { CREATE_USERNAME_SCREEN_ID, PHONE_SCREEN_ID } from 'shared/constants';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStore';
import { displayError } from 'utils/toastsMessages';
import SplashLoader from 'components/common/SplashLoader';

import { NOT_FULL_CODE_ERROR } from '../constants';
import { BackButton, SendButton, SubTitle, ErrorTextAbsolute } from '../commonStyled';

import { createTimerCookie } from '../SignUp';
import Timer from './Timer';

const NUMBER_OF_INPUTS = 4;

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const DividedInput = styled.input`
  width: 49px;
  height: 56px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  transition: box-shadow 150ms;
  appearance: none;
  -moz-appearance: textfield;

  ${({ error, theme }) => (error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed};` : ``)};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.blue};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
`;

const InputsWrapper = styled.div`
  display: flex;
  margin-top: 88px;

  & ${DividedInput}:not(:first-child) {
    margin-left: 8px;
  }
`;

const ResendWrapper = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 24px;
`;

const ResendCode = styled.button.attrs({ type: 'button' })`
  line-height: 20px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.blue};

  &:hover,
  &:focus {
    opacity: 0.8;
  }

  ${is('disable')`
    cursor: auto;
    opacity: 0.6;
    pointer-events: none;
  `};
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 88px;
`;

export default class ConfirmationCode extends PureComponent {
  static propTypes = {
    setScreenId: PropTypes.func.isRequired,
    fetchRegVerify: PropTypes.func.isRequired,
    isLoadingVerify: PropTypes.bool.isRequired,
    clearVerifyError: PropTypes.func.isRequired,
    sendVerifyError: PropTypes.string.isRequired,
    fetchResendSms: PropTypes.func.isRequired,
    fullPhoneNumber: PropTypes.string.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
    isResendSmsLoading: PropTypes.bool.isRequired,
    resendSmsError: PropTypes.string.isRequired,
    nextSmsRetry: PropTypes.number.isRequired,
  };

  state = {
    inputs: Array.from({ length: NUMBER_OF_INPUTS }).map(() => ''),
    codeError: '',
    timerSeconds: false,
    isSubmiting: false,
  };

  inputs = Array.from({ length: NUMBER_OF_INPUTS }).map(createRef);

  sendButtonRef = createRef();

  componentDidMount() {
    this.setTimeInCookie();
  }

  componentWillUnmount() {
    this.unmount = true;
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  onBackspacePress(e, position) {
    const { sendVerifyError, clearVerifyError } = this.props;
    const { inputs } = this.state;

    if (checkPressedKey(e) !== KEY_CODES.BACKSPACE) {
      return;
    }

    const firstElemIndex = 0;

    if (position === firstElemIndex && !inputs[firstElemIndex]) {
      return;
    }

    if (sendVerifyError) {
      clearVerifyError();
    }

    const clonedInputs = Array.from(inputs);

    if (clonedInputs[position].trim()) {
      clonedInputs[position] = '';
    } else {
      clonedInputs[position - 1] = '';
    }

    this.setState({
      inputs: clonedInputs,
      codeError: '',
    });

    if (position > firstElemIndex) {
      this.inputs[position - 1].current.focus();
    }

    e.preventDefault();
  }

  setTimeInCookie() {
    const startSecondsQuantity = createTimerCookie();
    if (startSecondsQuantity) {
      this.setState({ timerSeconds: startSecondsQuantity });
    }
  }

  onSubmit = async e => {
    if (e) {
      e.preventDefault();
    }

    const { setScreenId, fetchRegVerify } = this.props;
    const { inputs } = this.state;
    const codeStr = inputs.join('');
    const code = Number.parseInt(codeStr, 10);

    if (codeStr.length < NUMBER_OF_INPUTS) {
      this.setState({ codeError: NOT_FULL_CODE_ERROR });
      return;
    }

    this.setState({
      isSubmiting: true,
    });

    try {
      const screenId = await fetchRegVerify(code);
      const currentScreenId = screenId || CREATE_USERNAME_SCREEN_ID;
      setScreenId(currentScreenId);
      setRegistrationData({ screenId: currentScreenId });
    } catch (err) {
      displayError(err);
    } finally {
      if (!this.unmount) {
        this.setState({
          isSubmiting: false,
        });
      }
    }
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;
    setScreenId(PHONE_SCREEN_ID);
    setRegistrationData({ screenId: PHONE_SCREEN_ID });
  };

  resendCode = async e => {
    const { fetchResendSms, fullPhoneNumber } = this.props;
    const { timerSeconds } = this.state;

    if (e) {
      e.target.blur();
    }

    if (timerSeconds > 0) {
      return;
    }

    try {
      await fetchResendSms(fullPhoneNumber);
      // eslint-disable-next-line react/destructuring-assignment
      const startSecondsQuantity = createTimerCookie(this.props.nextSmsRetry);
      this.setState({ timerSeconds: startSecondsQuantity });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      if (err.code === 1108) {
        this.setState({
          codeError: 'Too many retries',
        });
      }
    }
  };

  hideTimer = () => {
    this.setState({ timerSeconds: 0 });
  };

  inputValueChange(e, position) {
    const { sendVerifyError, clearVerifyError } = this.props;
    const { inputs } = this.state;

    let value = e.target.value.trim();
    value = value.replace(/\D+/g, '');

    if (!value) {
      return;
    }

    const clonedInputs = Array.from(inputs);

    const chars = value.split('');
    for (let i = 0; i < chars.length && i + position < NUMBER_OF_INPUTS; i++) {
      clonedInputs[i + position] = chars[i] || '';
    }

    if (sendVerifyError) {
      clearVerifyError();
    }

    this.setState(
      {
        inputs: clonedInputs,
        codeError: '',
      },
      () => {
        const nextPos = position + 1;

        if (nextPos < NUMBER_OF_INPUTS) {
          this.inputs[nextPos].current.focus();
        }

        if (nextPos === NUMBER_OF_INPUTS || chars.length === NUMBER_OF_INPUTS) {
          this.sendButtonRef.current.focus();

          this.onSubmit();
        }
      }
    );
  }

  renderInputs() {
    const { sendVerifyError } = this.props;
    const { inputs, codeError } = this.state;
    const notFullCodeError = codeError === NOT_FULL_CODE_ERROR;

    return Array.from({ length: NUMBER_OF_INPUTS }).map((item, index) => (
      <DividedInput
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        ref={this.inputs[index]}
        type="number"
        min="0"
        max="9"
        maxLength="1"
        name={`sign-up__confirmation-code-input-${index + 1}`}
        autoFocus={index === 0}
        autoComplete="off"
        inputMode="numeric"
        value={inputs[index]}
        error={(notFullCodeError && !inputs[index]) || sendVerifyError}
        className={`js-ConfirmationCodeInput-${index}`}
        onKeyDown={e => this.onBackspacePress(e, index)}
        onChange={e => this.inputValueChange(e, index)}
      />
    ));
  }

  render() {
    const { isLoadingVerify, sendVerifyError, isResendSmsLoading, resendSmsError } = this.props;
    const { codeError, timerSeconds, isSubmiting } = this.state;

    let resendText = 'Resend verification code';
    if (isResendSmsLoading) {
      resendText = <LoadingRegText />;
    }
    if (resendSmsError) {
      resendText = "Code didn't resend. Try again";
    }

    return (
      <FormStyled onSubmit={this.onSubmit}>
        {isLoadingVerify ? <SplashLoader /> : null}
        <SubTitle>Enter verification code from SMS</SubTitle>
        <InputsWrapper>{this.renderInputs()}</InputsWrapper>
        <ResendWrapper>
          <ResendCode
            disable={isResendSmsLoading ? 1 : 0}
            className="js-ConfirmationCodeResend"
            onClick={this.resendCode}
          >
            {resendText}
            &nbsp;
            {Boolean(timerSeconds) && (
              <Timer startingTime={timerSeconds} hideTimer={this.hideTimer} />
            )}
          </ResendCode>
          <ErrorTextAbsolute>{codeError || sendVerifyError}</ErrorTextAbsolute>
        </ResendWrapper>
        <SendButtonStyled
          ref={this.sendButtonRef}
          className="js-ConfirmationCodeSend"
          disabled={isSubmiting}
        >
          Next
        </SendButtonStyled>
        <BackButton className="js-ConfirmationCodeBack" onClick={this.backToPreviousScreen}>
          Back
        </BackButton>
      </FormStyled>
    );
  }
}
