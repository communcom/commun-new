import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { injectFeatureToggles } from '@flopflip/react-redux';

import { screenTypeType } from 'types';
import { up, styles } from '@commun/ui';
import { getRegistrationData } from 'utils/localStore';
import { applyRef } from 'utils/hocs';
import { trackEvent } from 'utils/analytics';

import { ONBOARDING_REGISTRATION_WAIT_KEY } from 'shared/constants';
import {
  OAUTH_SCREEN_ID,
  REGISTERED_SCREEN_ID,
  PHONE_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  CREATE_PASSWORD_SCREEN_ID,
  CONFIRM_PASSWORD_SCREEN_ID,
  ATTENTION_BEFORE_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
  ATTENTION_AFTER_SCREEN_ID,
} from 'shared/constants/registration';
import { FEATURE_OAUTH } from 'shared/featureFlags';
import CloseButton from 'components/common/CloseButton';
import { MILLISECONDS_IN_SECOND } from './constants';

import Oauth from './Oauth';
import Registered from './Registered';
import Phone from './Phone';
import ConfirmationCode from './ConfirmationCode';
import CreateUsername from './CreateUsername';
import CreatePassword from './CreatePassword';
import ConfirmPassword from './ConfirmPassword';
import AttentionBefore from './AttentionBefore';
import MasterKey from './MasterKey';
import AttentionAfter from './AttentionAfter';

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

@injectFeatureToggles([FEATURE_OAUTH])
@applyRef('modalRef')
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
    trackEvent('Open screen 1.1.0');

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

    let willClose = false;

    if (
      [
        CONFIRM_CODE_SCREEN_ID,
        CREATE_USERNAME_SCREEN_ID,
        CREATE_PASSWORD_SCREEN_ID,
        CONFIRM_PASSWORD_SCREEN_ID,
      ].includes(screenId)
    ) {
      willClose = await openConfirmDialog(
        'You should complete registration, data can be missed otherwise.',
        {
          confirmText: 'Close',
        }
      );
    }

    if (
      screenId === '' ||
      [OAUTH_SCREEN_ID, PHONE_SCREEN_ID, REGISTERED_SCREEN_ID].includes(screenId)
    ) {
      willClose = true;
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
      case OAUTH_SCREEN_ID:
        CurrentScreen = Oauth;
        break;
      case REGISTERED_SCREEN_ID:
        CurrentScreen = Registered;
        break;
      case PHONE_SCREEN_ID:
        CurrentScreen = Phone;
        break;
      case CONFIRM_CODE_SCREEN_ID:
        CurrentScreen = ConfirmationCode;
        break;
      case CREATE_USERNAME_SCREEN_ID:
        CurrentScreen = CreateUsername;
        break;
      case CREATE_PASSWORD_SCREEN_ID:
        CurrentScreen = CreatePassword;
        break;
      case CONFIRM_PASSWORD_SCREEN_ID:
        CurrentScreen = ConfirmPassword;
        break;
      case ATTENTION_BEFORE_SCREEN_ID:
        CurrentScreen = AttentionBefore;
        break;
      case MASTER_KEY_SCREEN_ID:
        CurrentScreen = MasterKey;
        break;
      case ATTENTION_AFTER_SCREEN_ID:
        CurrentScreen = AttentionAfter;
        break;
      default:
        CurrentScreen = featureToggles[FEATURE_OAUTH] ? Oauth : Phone;
    }

    const isMasterScreen = screenId === MASTER_KEY_SCREEN_ID;
    const isWithoutTitle = [
      MASTER_KEY_SCREEN_ID,
      CREATE_PASSWORD_SCREEN_ID,
      CONFIRM_PASSWORD_SCREEN_ID,
      ATTENTION_BEFORE_SCREEN_ID,
      ATTENTION_AFTER_SCREEN_ID,
    ].includes(screenId);
    const isNoPadding = [
      MASTER_KEY_SCREEN_ID,
      ATTENTION_BEFORE_SCREEN_ID,
      ATTENTION_AFTER_SCREEN_ID,
    ].includes(screenId);

    const title = screenId === REGISTERED_SCREEN_ID ? 'Oops' : 'Sign up';

    return (
      <Wrapper className={`js-SignUp-${screenId || PHONE_SCREEN_ID}-modal`} noPadding={isNoPadding}>
        <TestCloseButton onClick={this.closeModal}>Close</TestCloseButton>
        {screenType === 'mobile' && !isMasterScreen ? (
          <CloseButton onClick={this.closeModal} />
        ) : null}
        {isWithoutTitle ? null : <Title>{title}</Title>}
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
