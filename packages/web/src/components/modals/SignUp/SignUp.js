import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { up } from '@commun/ui';
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
} from 'shared/constants/registration';
import { MILLISECONDS_IN_SECOND } from './constants';

import Phone from './Phone';
import ConfirmationCode from './ConfirmationCode';
import CreateUsername from './CreateUsername';
import MasterKey from './MasterKey';

const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 40px 8px 37px; /* steps with captcha should have 8px right-left paddings on 320px screen width */
  background-color: #fff;

  @media (min-width: 360px) {
    padding: 40px 26px 37px; /* perfect fit in iPhone 5/SE */
  }

  ${up.mobileLandscape} {
    width: 416px;
    max-width: 416px;
    padding: 40px 56px;
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
  margin: 12px 0;
  font-size: 32px;
  font-weight: 600;
`;

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
  };

  static defaultProps = {
    openedFrom: '',
  };

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
    if (
      screenId === CONFIRM_CODE_SCREEN_ID ||
      screenId === CREATE_USERNAME_SCREEN_ID ||
      screenId === MASTER_KEY_SCREEN_ID
    ) {
      return openConfirmDialog('You should complete registration, data can be missed otherwise.', {
        confirmText: 'Close',
      });
    }
    return true;
  };

  closeModal = async () => {
    if (await this.canClose()) {
      const { close } = this.props;

      close();
    }
  };

  render() {
    const { openedFrom, screenId, setScreenId, screenType, openModal, close } = this.props;

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
      default:
        CurrentScreen = Phone;
    }

    const isMasterScreen = screenId === MASTER_KEY_SCREEN_ID;

    return (
      <Wrapper
        className={`js-SignUp-${screenId || PHONE_SCREEN_ID}-modal`}
        noPadding={isMasterScreen}
      >
        {screenType === 'mobile' && !isMasterScreen ? (
          <CloseButton onClick={this.closeModal} />
        ) : null}
        {isMasterScreen ? null : <Title>Sign up</Title>}
        <CurrentScreen
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
