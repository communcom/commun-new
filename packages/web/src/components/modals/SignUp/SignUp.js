import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { styles, up } from '@commun/ui';

import { screenTypeType } from 'types';
import { ONBOARDING_REGISTRATION_WAIT_KEY } from 'shared/constants';
import {
  ATTENTION_AFTER_SCREEN_ID,
  ATTENTION_BEFORE_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CONFIRM_EMAIL_SCREEN_ID,
  CONFIRM_PASSWORD_SCREEN_ID,
  CREATE_PASSWORD_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  EMAIL_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
  OAUTH_SCREEN_ID,
  PHONE_SCREEN_ID,
  REGISTERED_SCREEN_ID,
} from 'shared/constants/registration';
import { FEATURE_OAUTH } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';
import { applyRef } from 'utils/hocs';
import { getRegistrationData } from 'utils/localStore';

import CloseButton from 'components/common/CloseButton';
import AttentionAfter from './AttentionAfter';
import AttentionBefore from './AttentionBefore';
import ConfirmationCode from './ConfirmationCode';
import ConfirmEmail from './ConfirmEmail';
import ConfirmPassword from './ConfirmPassword';
import CreatePassword from './CreatePassword';
import CreateUsername from './CreateUsername';
import Email from './Email';
import MasterKey from './MasterKey';
import Oauth from './Oauth';
import Phone from './Phone';
import Registered from './Registered';

const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  padding: 24px 8px 30px; /* steps with captcha should have 8px right-left paddings on 320px screen width */
  background-color: ${({ theme }) => theme.colors.white};

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

@withTranslation()
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
    const { screenId, openConfirmDialog, t } = this.props;

    let willClose = false;

    if (
      [
        CONFIRM_CODE_SCREEN_ID,
        EMAIL_SCREEN_ID,
        CONFIRM_EMAIL_SCREEN_ID,
        CREATE_USERNAME_SCREEN_ID,
        CREATE_PASSWORD_SCREEN_ID,
        CONFIRM_PASSWORD_SCREEN_ID,
      ].includes(screenId)
    ) {
      willClose = await openConfirmDialog(t('modals.sign_up.can_close'), {
        confirmText: t('common.close'),
      });
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
      t,
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
      case EMAIL_SCREEN_ID:
        CurrentScreen = Email;
        break;
      case CONFIRM_EMAIL_SCREEN_ID:
        CurrentScreen = ConfirmEmail;
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

    const title =
      screenId === REGISTERED_SCREEN_ID
        ? t('modals.sign_up.title-oops')
        : t('modals.sign_up.title');

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
