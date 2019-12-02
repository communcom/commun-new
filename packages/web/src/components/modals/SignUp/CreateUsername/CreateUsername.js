import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { KEY_CODES, ComplexInput } from '@commun/ui';
import { MASTER_KEY_SCREEN_ID, PHONE_SCREEN_ID } from 'shared/constants';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStore';

import { USERNAME_INVALID, USERNAME_EMPTY_ERROR, NAME_SHOULD_CONTAIN_ONE_DOT } from '../constants';
import { SubTitle, SendButton, BackButton } from '../commonStyled';
import SplashLoader from '../SplashLoader';

import { usernameHints } from '../../hints';

const UsernameInput = styled(ComplexInput)`
  width: 100%;
  margin-top: 40px;

  && input {
    text-align: left;
  }
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 142px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 304px;
`;

export default class CreateUsername extends PureComponent {
  static propTypes = {
    wishUsername: PropTypes.string.isRequired,
    setScreenId: PropTypes.func.isRequired,
    setWishUsername: PropTypes.func.isRequired,
    isLoadingSetUser: PropTypes.bool.isRequired,
    fetchSetUser: PropTypes.func.isRequired,
    sendUserError: PropTypes.string.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    usernameError: '',
  };

  componentDidMount() {
    const { wishUsername } = this.props;
    if (wishUsername) {
      this.setState({ username: wishUsername });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { wishUsername } = this.props;
    if (wishUsername !== nextProps.wishUsername) {
      this.setState({ username: nextProps.wishUsername });
    }
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  nextScreen = async () => {
    const { setScreenId, fetchSetUser } = this.props;
    const { username } = this.state;

    if (!this.checkUsername(username)) {
      return;
    }

    try {
      const screenId = await fetchSetUser(username);
      const currentScreenId = screenId || MASTER_KEY_SCREEN_ID;
      setScreenId(currentScreenId);
      setRegistrationData({ screenId: currentScreenId });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;
    setScreenId(PHONE_SCREEN_ID);
    setRegistrationData({ screenId: PHONE_SCREEN_ID });
  };

  enterUsername = value => {
    const { username } = this.state;
    let currentUsername = value.trim();
    currentUsername = currentUsername.toLowerCase();
    currentUsername = currentUsername.replace(/[^a-z0-9-]+/g, '');

    if (username !== currentUsername) {
      this.setState({ username: currentUsername, usernameError: '' });
    }
  };

  usernameInputBlur = () => {
    const { setWishUsername } = this.props;
    const { username } = this.state;
    setWishUsername(username);
    setRegistrationData({ wishUsername: username });
  };

  enterKeyDown = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.usernameInputBlur();
      this.nextScreen();
    }
  };

  checkUsername(username) {
    if (!username) {
      this.setState({ usernameError: USERNAME_EMPTY_ERROR });
      return false;
    }
    if ((username.match(/\./g) || []).length > 1) {
      this.setState({ usernameError: NAME_SHOULD_CONTAIN_ONE_DOT });
      return false;
    }

    if (!/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/.test(username)) {
      this.setState({ usernameError: USERNAME_INVALID });
      return false;
    }

    return true;
  }

  render() {
    const { isLoadingSetUser, sendUserError } = this.props;
    const { username, usernameError } = this.state;

    return (
      <>
        {isLoadingSetUser ? <SplashLoader /> : null}
        <SubTitle>Create username</SubTitle>
        <InputWrapper>
          <UsernameInput
            autoFocus
            maxLength={32}
            placeholder="Username"
            value={username}
            error={usernameError || sendUserError}
            className="js-CreateUsernameInput"
            onKeyDown={this.enterKeyDown}
            onChange={this.enterUsername}
            onBlur={this.usernameInputBlur}
            hint={usernameHints}
          />
        </InputWrapper>
        <SendButtonStyled className="js-CreateUsernameSend" onClick={this.nextScreen}>
          Next
        </SendButtonStyled>
        <BackButton className="js-CreateUsernameBack" onClick={this.backToPreviousScreen}>
          Back
        </BackButton>
      </>
    );
  }
}
