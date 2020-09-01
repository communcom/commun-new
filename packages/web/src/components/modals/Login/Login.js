import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import styled from 'styled-components';

import { ComplexInput, up } from '@commun/ui';

import { screenTypeType } from 'types';
import {
  CAPTCHA_KEY,
  LOGIN_ERROR_INVALID_CREDENTIALS,
  LOGIN_ERROR_INVALID_USERNAME,
  LOGIN_ERROR_NOT_FOUND,
  LOGIN_ERROR_USER_NOT_FOUND,
} from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { captureException } from 'utils/errors';
import { applyRef } from 'utils/hocs';
import { displayError } from 'utils/toastsMessages';
import { OPENED_FROM_LOGIN, SHOW_MODAL_SIGNUP } from 'store/constants/modalTypes';

import CloseButton from 'components/common/CloseButton';
import Recaptcha from 'components/common/Recaptcha';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 56px 8px 40px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 360px) {
    padding: 56px 26px 40px;
  }

  ${up.mobileLandscape} {
    width: 416px;
    max-width: 416px;
    border-radius: 20px;
    padding: 56px 56px 40px;
  }
`;

const Title = styled.div`
  margin-bottom: 74px; /* perfect fit in iPhone 5/SE */
  text-align: center;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.black};

  ${up.mobileLandscape} {
    margin-bottom: 90px;
  }
`;

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 304px;
`;

const InputStyled = styled(ComplexInput)`
  margin: 6px 0;

  &:last-of-type {
    margin-bottom: 12px;
  }
`;

const ErrorBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 70px;
`;

const ErrorText = styled.div`
  color: #f00;
`;

const SubmitButton = styled.button`
  padding: 18px;
  margin-top: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.blue};

  line-height: 20px;
  font-size: 17px;
  text-align: center;

  color: #fff;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => rgba(theme.colors.blue, 0.8)};
  }
`;

const CreateAccountLink = styled.button`
  margin-top: 38px;

  line-height: 1;
  font-size: 15px;
  text-align: center;

  color: ${({ theme }) => theme.colors.blue};

  &:hover,
  &:focus {
    color: ${({ theme }) => rgba(theme.colors.blue, 0.8)};
  }
`;

@withTranslation()
@applyRef('modalRef')
export default class Login extends Component {
  static propTypes = {
    screenType: screenTypeType.isRequired,
    userInputGateLogin: PropTypes.func.isRequired,
    claimAirdrop: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    user: '',
    password: '',
    recaptchaResponse: null,
    loginError: null,
  };

  handleChange = name => value => {
    this.setState({
      [name]: value,
      loginError: null,
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { userInputGateLogin, claimAirdrop, close, t } = this.props;
    const { user, password, recaptchaResponse } = this.state;

    if (CAPTCHA_KEY && !recaptchaResponse) {
      displayError(t('modals.login.toastsMessages.recaptcha_failed'));
      return;
    }

    const userInput = user.trim();

    this.setState({
      loginError: null,
    });

    try {
      const results = await userInputGateLogin(userInput, password, recaptchaResponse);

      this.setState(
        {
          recaptchaResponse: null,
        },
        () => {
          close(results);
        }
      );

      claimAirdrop();
    } catch (err) {
      switch (err.message) {
        case LOGIN_ERROR_INVALID_CREDENTIALS:
        case LOGIN_ERROR_USER_NOT_FOUND:
        case LOGIN_ERROR_NOT_FOUND:
        case LOGIN_ERROR_INVALID_USERNAME:
          // save original message for debugging
          err.originalMessage = err.message;
          err.message = t('modals.login.errors.invalid');
          break;

        default:
          break;
      }
      captureException(err);

      this.setState({
        loginError: err,
      });
    }
  };

  onCaptchaChange = response => {
    this.setState({
      recaptchaResponse: response,
    });
  };

  replaceWithSignUpModal = () => {
    const { openModal, close } = this.props;
    close(openModal(SHOW_MODAL_SIGNUP, { openedFrom: OPENED_FROM_LOGIN }));
  };

  render() {
    const { screenType, close, t } = this.props;
    const { user, password, loginError } = this.state;

    return (
      <Wrapper>
        {screenType === 'mobile' ? <CloseButton onClick={close} /> : null}
        <Title>{t('modals.login.title')}</Title>
        <FormStyled onSubmit={this.handleSubmit}>
          <InputStyled
            type="text"
            autoComplete="username"
            name="login__username-input"
            value={user}
            placeholder={t('modals.login.username')}
            onChange={this.handleChange('user')}
          />
          <InputStyled
            type="password"
            autoComplete="current-password"
            name="login__password-input"
            value={password}
            placeholder={t('modals.login.password')}
            onChange={this.handleChange('password')}
          />
          <Recaptcha onCaptchaChange={this.onCaptchaChange} />
          <ErrorBlock>
            {loginError ? (
              <ErrorText>{t('modals.login.error', { error: loginError.message })}</ErrorText>
            ) : null}
          </ErrorBlock>
          <SubmitButton name="login__submit">{t('modals.login.submit')}</SubmitButton>
          <CreateAccountLink
            type="button"
            name="login__switch-to-signup"
            onClick={this.replaceWithSignUpModal}
          >
            {t('modals.login.sign_up')}
          </CreateAccountLink>
        </FormStyled>
      </Wrapper>
    );
  }
}
