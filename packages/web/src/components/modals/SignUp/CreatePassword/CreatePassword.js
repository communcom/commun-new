import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import is from 'styled-is';

import { Button } from '@commun/ui';

import {
  ATTENTION_BEFORE_SCREEN_ID,
  CONFIRM_PASSWORD_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
} from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';
import { setRegistrationData } from 'utils/localStore';
import { normalizePassword, validatePassword } from 'utils/validatingInputs';

import PasswordInput from '../common/PasswordInput';
import { BackButton, SendButton, SubTitle, Title } from '../commonStyled';

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

@withTranslation()
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

  componentDidMount() {
    trackEvent('Open screen enter password');
  }

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
    const { setScreenId, setWishPassword } = this.props;

    trackEvent('Сlick use master password (enter password)');

    // Clean user password for generation in next steps
    setWishPassword('');
    setRegistrationData({ screenId: ATTENTION_BEFORE_SCREEN_ID, password: '' });

    setScreenId(ATTENTION_BEFORE_SCREEN_ID);
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
    const { t } = this.props;
    const { password } = this.state;
    const { isLowerCase, isUpperCase, isNumber, isMinLength } = validatePassword(password);

    return (
      <RulesWrapper>
        <Rule isActive={isLowerCase}>
          <Name>a</Name>
          <Description>{t('validations.password.lower_case')}</Description>
        </Rule>
        <Rule isActive={isUpperCase}>
          <Name>A</Name>
          <Description>{t('validations.password.upper_case')}</Description>
        </Rule>
        <Rule isActive={isNumber}>
          <Name>1</Name>
          <Description>{t('validations.password.number')}</Description>
        </Rule>
        <Rule isActive={isMinLength}>
          <Name>8+</Name>
          <Description>{t('validations.password.min_length')}</Description>
        </Rule>
      </RulesWrapper>
    );
  }

  render() {
    const { t } = this.props;
    const { password, passwordError, isPasswordChecking } = this.state;

    return (
      <>
        <Title>{t('modals.sign_up.create_password.title')}</Title>
        <SubTitle
          dangerouslySetInnerHTML={{
            __html: t('modals.sign_up.create_password.description'),
          }}
        />
        <PasswordInputStyled
          password={password}
          error={passwordError}
          onChange={this.onPasswordChange}
          onBlur={this.onPasswordBlur}
          onEnterKeyDown={this.onPasswordEnterKeyDown}
        />
        {this.renderRules()}
        <PasswordButton hollow transparent onClick={this.passwordScreen}>
          {t('modals.sign_up.create_password.use_password')}
        </PasswordButton>
        <SendButtonStyled
          disabled={passwordError || isPasswordChecking}
          className="js-CreatePasswordSend"
          onClick={this.nextScreen}
        >
          {t('common.next')}
        </SendButtonStyled>
        <BackButton className="js-CreatePasswordBack" onClick={this.backToPreviousScreen}>
          {t('common.back')}
        </BackButton>
      </>
    );
  }
}
