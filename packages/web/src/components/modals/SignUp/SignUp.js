import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { injectFeatureToggles } from '@flopflip/react-redux';

import { up, styles } from '@commun/ui';
import { getRegistrationData } from 'utils/localStore';
import { applyRef } from 'utils/hocs';
import { screenTypeType } from 'types';
import CloseButton from 'components/common/CloseButton';

import { ONBOARDING_REGISTRATION_WAIT_KEY } from 'shared/constants';
import {
  PHONE_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
  OAUTH_SCREEN_ID,
} from 'shared/constants/registration';
import { trackEvent } from 'utils/analytics';
import { ANALITIC_REGISTRAION_CANCELED } from 'shared/constants/analytics';
import { FEATURE_OAUTH } from 'shared/featureFlags';
import { MILLISECONDS_IN_SECOND } from './constants';

import Phone from './Phone';
import ConfirmationCode from './ConfirmationCode';
import CreateUsername from './CreateUsername';
import MasterKey from './MasterKey';
import Oauth from './Oauth';

const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  padding: 24px 8px 30px; /* steps with captcha should have 8px right-left paddings on 320px screen width */
  background-color: #fff;

  @media (min-width: 360px) {
    padding: 24px 26px 30px; /* perfect fit in iPhone 5/SE */
  }

  ${up.mobileLandscape} {
    width: 416px;
    max-width: 416px;
    padding: 24px 56px 30px;
    border-radius: 20px;
  }

  ${is('noPadding')`
    width: unset;
    flex-basis: 400px;
    padding: 0 !important;

    ${up.mobileLandscape} {
      max-width: 400px;
    }
  `};
`;

const Title = styled.h2`
  margin: 10px 0;
  font-size: 32px;
  font-weight: bold;
`;

// need for auto test
const TestCloseButton = styled.button.attrs({ type: 'button', name: 'sign-up__test-close-modal' })`
  z-index: 10;

  ${styles.visuallyHidden};
`;

const ANALITIC_REGISTRAION_CANCELED_SCREENS = {
  PHONE_SCREEN_ID: 1,
  CONFIRM_CODE_SCREEN_ID: 3,
  CREATE_USERNAME_SCREEN_ID: 4,
  MASTER_KEY_SCREEN_ID: 5,
};

@applyRef('modalRef')
@injectFeatureToggles([FEATURE_OAUTH])
export default class SignUp extends Component {
  static propTypes = {
    openedFrom: PropTypes.string,
    screenType: screenTypeType.isRequired,
    screenId: PropTypes.string.isRequired,
    setScreenId: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    setLocalStorageData: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    featureToggles: PropTypes.object.isRequired,
  };

  static defaultProps = {
    openedFrom: '',
  };

  currentScreenRef = createRef();

  componentDidMount() {
    localStorage[ONBOARDING_REGISTRATION_WAIT_KEY] = true;
    this.getPreviousDataIfNeeded();
  }

  componentWillUnmount() {
    const { setScreenId } = this.props;
    setScreenId('');
  }

  getPreviousDataIfNeeded() {
    const { setLocalStorageData } = this.props;
    setLocalStorageData(getRegistrationData());
  }

  canClose = async () => {
    const { screenId, openConfirmDialog } = this.props;

    let willClose = true;

    if (screenId === CONFIRM_CODE_SCREEN_ID || screenId === CREATE_USERNAME_SCREEN_ID) {
      willClose = openConfirmDialog(
        'You should complete registration, data can be missed otherwise.',
        {
          confirmText: 'Close',
        }
      );
    }

    if (screenId === MASTER_KEY_SCREEN_ID) {
      willClose = false;
    }

    if (willClose) {
      trackEvent(
        `${ANALITIC_REGISTRAION_CANCELED}${ANALITIC_REGISTRAION_CANCELED_SCREENS[screenId]}`
      );
    }

    return willClose;
  };

  closeModal = async () => {
    if (await this.canClose()) {
      const { close } = this.props;
      close();
    }
  };

  render() {
    const {
      openedFrom,
      screenId,
      setScreenId,
      screenType,
      openModal,
      close,
      featureToggles,
    } = this.props;

    let CurrentScreen;
    switch (screenId) {
      case CONFIRM_CODE_SCREEN_ID:
        CurrentScreen = ConfirmationCode;
        break;
      case CREATE_USERNAME_SCREEN_ID:
        CurrentScreen = CreateUsername;
        break;
      case MASTER_KEY_SCREEN_ID:
        CurrentScreen = MasterKey;
        break;
      case PHONE_SCREEN_ID:
        CurrentScreen = Phone;
        break;
      case OAUTH_SCREEN_ID:
        CurrentScreen = Oauth;
        break;
      default:
        CurrentScreen = featureToggles[FEATURE_OAUTH] ? Oauth : Phone;
    }

    const isMasterScreen = screenId === MASTER_KEY_SCREEN_ID;

    return (
      <Wrapper
        className={`js-SignUp-${screenId || PHONE_SCREEN_ID}-modal`}
        noPadding={isMasterScreen}
      >
        <TestCloseButton onClick={this.closeModal}>Close</TestCloseButton>
        {screenType === 'mobile' && !isMasterScreen ? (
          <CloseButton onClick={this.closeModal} />
        ) : null}
        {isMasterScreen ? null : <Title>Sign up</Title>}
        <CurrentScreen
          ref={this.currentScreenRef}
          openedFrom={openedFrom}
          setScreenId={setScreenId}
          openModal={openModal}
          close={close}
        />
      </Wrapper>
    );
  }
}

function setCookie(seconds) {
  const currentTime = Date.now();
  const expiredTime = currentTime + seconds * MILLISECONDS_IN_SECOND;
  const expiredDate = new Date(expiredTime).toUTCString();
  document.cookie = `resendCodeTimer=${expiredTime}; path=/; expires=${expiredDate}`;
  return seconds;
}
// eslint-disable-next-line consistent-return
export function createTimerCookie(nextSmsRetry) {
  if (nextSmsRetry) {
    const expectationTime = Math.round((nextSmsRetry - Date.now()) / 1000);
    if (expectationTime > 0) {
      return setCookie(expectationTime);
    }
  }
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const cookieKeyValue = cookie.split('=');
    if (cookieKeyValue[0] === 'resendCodeTimer') {
      return Math.round((cookieKeyValue[1] - Date.now()) / MILLISECONDS_IN_SECOND);
    }
  }
}
