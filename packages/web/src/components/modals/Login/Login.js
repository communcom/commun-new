import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import { Input, KEY_CODES } from '@commun/ui';
import { forwardRef } from 'utils/hocs';
import { checkPressedKey } from 'utils/keyPress';

import {
  MODAL_CONFIRM,
  MODAL_CANCEL,
  SHOW_MODAL_SIGNUP,
  OPENED_FROM_LOGIN,
} from 'store/constants/modalTypes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 400px;
  padding: 56px 56px 40px 56px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  margin-bottom: 90px;

  font-size: 32px;
  text-align: center;
  letter-spacing: -0.41px;

  color: #000;
`;

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputStyled = styled(Input)`
  margin: 6px 0;
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
  background-color: ${({ theme }) => theme.colors.contextBlue};

  line-height: 20px;
  font-size: 17px;
  text-align: center;
  letter-spacing: -0.41px;

  color: #fff;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => rgba(theme.colors.contextBlue, 0.8)};
  }
`;

const CreateAccountLink = styled.button`
  margin-top: 38px;

  line-height: 1;
  font-size: 15px;
  text-align: center;
  letter-spacing: -0.41px;

  color: ${({ theme }) => theme.colors.contextBlue};

  &:hover,
  &:focus {
    color: ${({ theme }) => rgba(theme.colors.contextBlue, 0.8)};
  }
`;

@forwardRef()
export default class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
  };

  state = {
    user: '',
    password: '',
    loginError: null,
  };

  handleChange = name => value =>
    this.setState({
      [name]: value,
      loginError: null,
    });

  handleSubmit = async () => {
    const { login, close } = this.props;
    const { user, password } = this.state;

    const userName = user.trim().toLowerCase();

    this.setState({
      loginError: null,
    });

    try {
      await login(userName, password, { needSaveAuth: true });

      close({ status: MODAL_CONFIRM });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      this.setState({
        loginError: err,
      });
    }
  };

  onKeyPressPassword = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.handleSubmit();
    }
  };

  replaceWithSignUpModal = async () => {
    const { openModal, close } = this.props;
    await close({ status: MODAL_CANCEL });
    openModal(SHOW_MODAL_SIGNUP, { openedFrom: OPENED_FROM_LOGIN });
  };

  canClose = async () => {
    const { openConfirmDialog } = this.props;
    return openConfirmDialog('State will be reset, are you sure?');
  };

  render() {
    const { user, password, loginError } = this.state;

    return (
      <Wrapper>
        <Title>Sign in</Title>
        <FormStyled>
          <InputStyled
            type="text"
            autocomplete="username"
            name="login__username-input"
            value={user}
            placeholder="Username"
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
