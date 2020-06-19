import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components';

import {
  ATTENTION_AFTER_SCREEN_ID,
  CREATE_PASSWORD_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
} from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';
import { setRegistrationData } from 'utils/localStore';
import { normalizePassword } from 'utils/validatingInputs';

import PasswordInput from '../common/PasswordInput';
import { BackButton, ErrorText, SendButton, SubTitle, Title } from '../commonStyled';

const PasswordInputStyled = styled(PasswordInput)`
  margin: 56px 0 0;
`;

const ErrorTextStyled = styled(ErrorText)`
  margin-top: 14px;
  text-align: center;
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 120px;
`;

@withTranslation()
export default class ConfirmPassword extends PureComponent {
  static propTypes = {
    wishPassword: PropTypes.string.isRequired,
    isMobile: PropTypes.bool,

    registrationUser: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isMobile: false,
  };

  state = {
    password: '',
    passwordError: true,
    isPasswordChecking: false,
  };

  componentDidMount() {
    trackEvent('Open screen confirm password');
  }

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
    const { wishPassword, registrationUser, setScreenId, isMobile } = this.props;
    const { password } = this.state;

    if (password !== wishPassword) {
      return;
    }

    let screenId = MASTER_KEY_SCREEN_ID;

    if (isMobile) {
      const result = registrationUser();

      if (!result) {
        return;
      }

      if (typeof result === 'string') {
        screenId = result;
      } else {
        screenId = ATTENTION_AFTER_SCREEN_ID;
      }
    }

    trackEvent('Сlick next (confirm password)');

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
    const { t } = this.props;
    const { password, passwordError, isPasswordChecking } = this.state;

    return (
      <>
        <Title>{t('modals.sign_up.confirm_password.title')}</Title>
        <SubTitle>{t('modals.sign_up.confirm_password.description')}</SubTitle>
        <PasswordInputStyled
          password={password}
          error={passwordError}
          onChange={this.onPasswordChange}
          onEnterKeyDown={this.onEnterKeyDown}
        />
        {passwordError ? (
          <ErrorTextStyled>{t('modals.sign_up.confirm_password.errors.same')}</ErrorTextStyled>
        ) : null}
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
