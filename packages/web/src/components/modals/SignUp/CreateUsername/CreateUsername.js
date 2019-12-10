import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

import { KEY_CODES, ComplexInput } from '@commun/ui';
import { MASTER_KEY_SCREEN_ID, PHONE_SCREEN_ID } from 'shared/constants';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStore';
import { validateUsername } from 'utils/validatingInputs';

import SplashLoader from 'components/common/SplashLoader';
import { SubTitle, SendButton, BackButton } from '../commonStyled';
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
    isUsernameChecking: false,
  };

  checkUsername = debounce(username => {
    const usernameError = validateUsername(username);

    this.setState({ usernameError, isUsernameChecking: false });
  }, 500);

  componentDidMount() {
    const { wishUsername } = this.props;

    if (wishUsername) {
      const usernameError = validateUsername(wishUsername);

      this.setState({ username: wishUsername, usernameError });
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
    this.checkUsername.cancel();
  }

  nextScreen = async () => {
    const { setScreenId, fetchSetUser } = this.props;
    const { username, usernameError, isUsernameChecking } = this.state;

    if (usernameError || isUsernameChecking) {
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

  usernameInputBlur = () => {
    const { setWishUsername } = this.props;
    const { username } = this.state;
    setWishUsername(username);
    setRegistrationData({ wishUsername: username });
  };

  enterUsername = value => {
    const { username } = this.state;
    let currentUsername = value.trim();
    currentUsername = currentUsername.toLowerCase();
    currentUsername = currentUsername.replace(/[^a-z0-9.-]+/g, '');
    this.checkUsername(currentUsername);

    if (username !== currentUsername) {
      this.setState({ username: currentUsername, isUsernameChecking: true });
    }
  };

  enterKeyDown = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.usernameInputBlur();
      this.nextScreen();
    }
  };

  render() {
    const { isLoadingSetUser, sendUserError } = this.props;
    const { username, usernameError, isUsernameChecking } = this.state;

    return (
      <>
        {isLoadingSetUser ? <SplashLoader /> : null}
        <SubTitle>Create username</SubTitle>
        <InputWrapper>
          <UsernameInput
            autoFocus
            minLength={5}
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
        <SendButtonStyled
          disabled={usernameError || isUsernameChecking}
          className="js-CreateUsernameSend"
          onClick={this.nextScreen}
        >
          Next
        </SendButtonStyled>
        <BackButton className="js-CreateUsernameBack" onClick={this.backToPreviousScreen}>
          Back
        </BackButton>
      </>
    );
  }
}
