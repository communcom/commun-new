import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import { ComplexInput, KEY_CODES, up } from '@commun/ui';
import { screenTypeType } from 'types';
import { forwardRef } from 'utils/hocs';
import { checkPressedKey } from 'utils/keyPress';
import { displayError } from 'utils/toastsMessages';

import { SHOW_MODAL_SIGNUP, OPENED_FROM_LOGIN } from 'store/constants/modalTypes';

import Recaptcha from 'components/common/Recaptcha';
import CloseButton from 'components/common/CloseButton';
import { usernameHints } from '../hints';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 56px 8px 40px;
  background-color: #fff;
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
  color: #000;

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

const Submit = styled.button`
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

@forwardRef('modalRef')
export default class Login extends Component {
  static propTypes = {
    screenType: screenTypeType.isRequired,
    userInputGateLogin: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    user: '',
    password: '',
    recaptchaResponse: '',
    loginError: null,
  };

  handleChange = name => value => {
    this.setState({
      [name]: value,
      loginError: null,
    });
  };

  handleSubmit = async () => {
    const { userInputGateLogin, close } = this.props;
    const { user, password, recaptchaResponse } = this.state;

    if (process.env.NODE_ENV === 'production' && !recaptchaResponse) {
      displayError('Recaptcha check failed');
      return;
    }

    const userInput = user.trim();

    this.setState({
      loginError: null,
    });

    try {
      const results = await userInputGateLogin(userInput, password, recaptchaResponse, {
        needSaveAuth: true,
      });

      this.setState(
        {
          recaptchaResponse: '',
        },
        () => {
          close(results);
        }
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      this.setState({
        loginError: err,
      });
    }
  };

  onCaptchaChange = e => {
    this.setState({
      recaptchaResponse: e,
    });
  };

  onKeyPressPassword = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.handleSubmit();
    }
  };

  replaceWithSignUpModal = async () => {
    const { openModal, close } = this.props;
    await close();
    openModal(SHOW_MODAL_SIGNUP, { openedFrom: OPENED_FROM_LOGIN });
  };

  render() {
    const { screenType, close } = this.props;
    const { user, password, loginError } = this.state;

    return (
      <Wrapper>
        {screenType === 'mobile' ? <CloseButton onClick={close} /> : null}
        <Title>Sign in</Title>
        <FormStyled>
          <InputStyled
            type="text"
            autocomplete="username"
            name="login__username-input"
            value={user}
            placeholder="Username"
            hint={usernameHints}
            onChange={this.handleChange('user')}
          />
          <InputStyled
            type="password"
            autocomplete="current-password"
            name="login__password-input"
            value={password}
            placeholder="Password"
            onKeyDown={this.onKeyPressPassword}
            onChange={this.handleChange('password')}
          />
          <Recaptcha onCaptchaChange={this.onCaptchaChange} />
          <ErrorBlock>
            {loginError ? <ErrorText>Error: {loginError.message}</ErrorText> : null}
          </ErrorBlock>
          <Submit name="login__submit" type="button" onClick={this.handleSubmit}>
            Login
          </Submit>
        </FormStyled>
        <CreateAccountLink name="login__switch-to-signup" onClick={this.replaceWithSignUpModal}>
          Don’t have an account?
        </CreateAccountLink>
      </Wrapper>
    );
  }
}
