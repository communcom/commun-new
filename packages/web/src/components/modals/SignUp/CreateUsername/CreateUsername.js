import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

import { KEY_CODES, ComplexInput } from '@commun/ui';
import { ANALYTIC_USERNAME_ENTERED } from 'shared/constants/analytics';
import { PHONE_SCREEN_ID, OAUTH_SCREEN_ID } from 'shared/constants';
import { checkPressedKey } from 'utils/keyboard';
import { setRegistrationData, getRegistrationData } from 'utils/localStore';
import { validateUsername } from 'utils/validatingInputs';
import { trackEvent } from 'utils/analytics';
import { resetCookies } from 'utils/cookies';

import SplashLoader from 'components/common/SplashLoader';
import { SubTitle, SendButton, BackButton } from '../commonStyled';
import { usernameHints } from '../../hints';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 304px;
  max-height: 56px;

  & input {
    padding: 17px 16px;
  }
`;

const UsernameInput = styled(ComplexInput)`
  width: 100%;
  margin-top: 52px;

  && input {
    text-align: left;
  }
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 220px;
`;

export default class CreateUsername extends PureComponent {
  static propTypes = {
    wishUsername: PropTypes.string.isRequired,
    isLoadingSetUser: PropTypes.bool.isRequired,
    retinaSuffix: PropTypes.string.isRequired,
    sendUserError: PropTypes.string.isRequired,

    setWishUsername: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
    fetchSetUser: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    usernameError: '',
    isUsernameChecking: false,
  };

  checkUsername = debounce(username => {
    const usernameError = validateUsername(username);

    if (usernameError) {
      trackEvent(ANALYTIC_USERNAME_ENTERED, { available: 'error' });
    }

    this.setState({ usernameError, isUsernameChecking: false });
  }, 500);

  componentDidMount() {
    const { wishUsername, retinaSuffix } = this.props;

    if (wishUsername) {
      const usernameError = validateUsername(wishUsername);

      if (usernameError) {
        trackEvent(ANALYTIC_USERNAME_ENTERED, { available: 'error' });
      }

      this.setState({
        username: wishUsername,
        usernameError,
      });
    }

    // image preloading for next screen
    const image = new Image();
    image.src = `/images/save-key${retinaSuffix}.png`;
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

      trackEvent(ANALYTIC_USERNAME_ENTERED, { available: 'error' });

      setScreenId(screenId);
      setRegistrationData({ screenId });
      resetCookies(['commun_oauth_state']);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;

    const { type } = getRegistrationData();
    const screenId = type === 'oauth' ? OAUTH_SCREEN_ID : PHONE_SCREEN_ID;

    setScreenId(screenId);
    setRegistrationData({ screenId });
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
      this.setState({
        username: currentUsername,
        isUsernameChecking: true,
      });
    }
  };

  enterKeyDown = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.usernameInputBlur();
      this.nextScreen();
    }
  };

  onUsernameHint = () => {
    trackEvent(ANALYTIC_USERNAME_ENTERED, { available: 'help' });
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
            onHint={this.onUsernameHint}
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
