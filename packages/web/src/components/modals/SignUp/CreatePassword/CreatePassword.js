import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import debounce from 'lodash.debounce';

import { Button } from '@commun/ui';
import {
  CREATE_USERNAME_SCREEN_ID,
  CONFIRM_PASSWORD_SCREEN_ID,
  ATTENTION_BEFORE_SCREEN_ID,
} from 'shared/constants';
import { setRegistrationData } from 'utils/localStore';
import { validatePassword, normalizePassword } from 'utils/validatingInputs';
import PasswordInput from '../common/PasswordInput';
import { Title, SubTitle, SendButton, BackButton } from '../commonStyled';

const Bold = styled.span`
  font-weight: bold;
`;

const PasswordInputStyled = styled(PasswordInput)`
  margin: 19px 0 0;
`;

const RulesWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 15px;
`;

const Rule = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-weight: 500;
  line-height: 26px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.blue};
  `}
`;

const Name = styled.div`
  font-size: 22px;
`;

const Description = styled.span`
  font-size: 12px;
`;

const PasswordButton = styled(Button)`
  margin-top: 52px;
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 70px;
`;

export default class CreatePassword extends PureComponent {
  static propTypes = {
    wishPassword: PropTypes.string.isRequired,

    setWishPassword: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  state = {
    password: '',
    passwordError: true,
    isPasswordChecking: false,
  };

  checkPassword = debounce(password => {
    const { isLowerCase, isUpperCase, isNumber, isMinLength } = validatePassword(password);

    this.setState({
      passwordError: !isLowerCase || !isUpperCase || !isNumber || !isMinLength,
      isPasswordChecking: false,
    });
  }, 500);

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
    this.checkPassword.cancel();
  }

  passwordScreen = () => {
    const { setScreenId } = this.props;
    setScreenId(ATTENTION_BEFORE_SCREEN_ID);
    setRegistrationData({ screenId: ATTENTION_BEFORE_SCREEN_ID });
  };

  nextScreen = () => {
    const { setScreenId } = this.props;
    const { passwordError, isPasswordChecking } = this.state;

    if (passwordError || isPasswordChecking) {
      return;
    }

    const currentScreenId = CONFIRM_PASSWORD_SCREEN_ID;
    setScreenId(currentScreenId);
    setRegistrationData({ screenId: currentScreenId });
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;

    const screenId = CREATE_USERNAME_SCREEN_ID;
    setScreenId(screenId);
    setRegistrationData({ screenId });
  };

  setPasswordInStore = () => {
    const { setWishPassword, wishPassword } = this.props;
    const { password } = this.state;

    if (wishPassword !== password) {
      setWishPassword(password);
      setRegistrationData({ password });
    }
  };

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

  onPasswordBlur = () => {
    this.setPasswordInStore();
  };

  onPasswordEnterKeyDown = () => {
    this.nextScreen();
  };

  renderRules() {
    const { password } = this.state;
    const { isLowerCase, isUpperCase, isNumber, isMinLength } = validatePassword(password);

    return (
      <RulesWrapper>
        <Rule isActive={isLowerCase}>
          <Name>a</Name>
          <Description>Lower case</Description>
        </Rule>
        <Rule isActive={isUpperCase}>
          <Name>A</Name>
          <Description>Upper case</Description>
        </Rule>
        <Rule isActive={isNumber}>
          <Name>1</Name>
          <Description>Number</Description>
        </Rule>
        <Rule isActive={isMinLength}>
          <Name>8+</Name>
          <Description>Min length</Description>
        </Rule>
      </RulesWrapper>
    );
  }

  render() {
    const { password, passwordError, isPasswordChecking } = this.state;

    return (
      <>
        <Title>Create password</Title>
        <SubTitle>
          We do not keep passwords and have no opportunity to restore them. <br />
          <Bold>Please save your password.</Bold>
        </SubTitle>
        <PasswordInputStyled
          password={password}
          error={passwordError}
          onChange={this.onPasswordChange}
          onBlur={this.onPasswordBlur}
          onEnterKeyDown={this.onPasswordEnterKeyDown}
        />
        {this.renderRules()}
        <PasswordButton hollow transparent onClick={this.passwordScreen}>
          I want to use Master Password
        </PasswordButton>
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
