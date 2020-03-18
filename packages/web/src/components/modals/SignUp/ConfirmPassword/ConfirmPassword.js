import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

import { CREATE_PASSWORD_SCREEN_ID, MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { setRegistrationData } from 'utils/localStore';
import { normalizePassword } from 'utils/validatingInputs';

import PasswordInput from '../common/PasswordInput';
import { SubTitle, SendButton, BackButton, ErrorText } from '../commonStyled';

const ErrorTextStyled = styled(ErrorText)`
  margin-top: 14px;
  text-align: center;
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 120px;
`;

export default class ConfirmPassword extends PureComponent {
  static propTypes = {
    wishPassword: PropTypes.string.isRequired,

    setScreenId: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  state = {
    password: '',
    passwordError: '',
    isPasswordChecking: false,
  };

  checkPassword = debounce(password => {
    const { wishPassword } = this.props;

    this.setState({
      passwordError: password !== wishPassword,
      isPasswordChecking: false,
    });
  }, 500);

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
    this.checkPassword.cancel();
  }

  onPasswordChange = e => {
    const { password } = this.state;
    const currentPassword = normalizePassword(e.target.value);

    this.checkPassword(currentPassword);

    if (password !== currentPassword) {
      this.setState({
        password: currentPassword,
        isPasswordChecking: true,
      });
    }
  };

  onEnterKeyDown = () => {
    this.nextScreen();
  };

  nextScreen = async () => {
    const { wishPassword, setScreenId } = this.props;
    const { password } = this.state;

    if (password !== wishPassword) {
      return;
    }

    const screenId = MASTER_KEY_SCREEN_ID;

    setScreenId(screenId);
    setRegistrationData({ screenId });
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;

    const screenId = CREATE_PASSWORD_SCREEN_ID;

    setScreenId(screenId);
    setRegistrationData({ screenId });
  };

  render() {
    const { password, passwordError, isPasswordChecking } = this.state;

    return (
      <>
        <SubTitle>Confirm password</SubTitle>
        <PasswordInput
          password={password}
          error={passwordError}
          onChange={this.onPasswordChange}
          onEnterKeyDown={this.onEnterKeyDown}
        />
        {passwordError ? <ErrorTextStyled>Password must be the same</ErrorTextStyled> : null}
        <SendButtonStyled
          disabled={passwordError || isPasswordChecking}
          className="js-CreatePasswordSend"
          onClick={this.nextScreen}
        >
          Next
        </SendButtonStyled>
        <BackButton className="js-CreatePasswordBack" onClick={this.backToPreviousScreen}>
          Back
        </BackButton>
      </>
    );
  }
}
