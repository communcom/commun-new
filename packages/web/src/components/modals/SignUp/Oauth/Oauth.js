import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { REGISTRATION_OPENED_FROM_KEY, UNAUTH_STATE_KEY } from 'shared/constants';
import { ANALYTIC_PROVIDERS_INDEX } from 'shared/constants/analytics';
import {
  FEATURE_EMAIL_REGISTRATION,
  FEATURE_OAUTH_APPLE,
  FEATURE_OAUTH_FACEBOOK,
  FEATURE_OAUTH_GOOGLE,
  FEATURE_OAUTH_TELEGRAM,
} from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';
import { setRegistrationData } from 'utils/localStore';
import { SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';

import TermsAgree from '../common/TermsAgree';
import TelegramLoginButton from './TelegramLoginButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 28px;

  width: 100%;
`;

const ProviderIcon = styled(Icon)`
  margin-right: 12px;

  width: 25px;
  height: 25px;
`;

const ContinueWithButton = styled.button`
  display: flex;
  align-items: center;

  margin-bottom: 12px;
  padding: 12px 20px;
  width: 100%;

  font-weight: 600;
  font-size: 17px;
  line-height: 20px;

  border-radius: 6px;

  .name {
    text-transform: capitalize;
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  padding-top: 30px;
`;

const SwitchText = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

const SwitchButton = styled(SwitchText).attrs({ as: 'button', type: 'button' })`
  color: ${({ theme }) => theme.colors.blue};
`;

@injectFeatureToggles([
  FEATURE_OAUTH_GOOGLE,
  FEATURE_OAUTH_FACEBOOK,
  FEATURE_OAUTH_APPLE,
  FEATURE_EMAIL_REGISTRATION,
  FEATURE_OAUTH_TELEGRAM,
])
@withTranslation()
export default class Oauth extends PureComponent {
  static propTypes = {
    openedFrom: PropTypes.string,
    unauthState: PropTypes.object.isRequired,
    referralId: PropTypes.string,

    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    featureToggles: PropTypes.object.isRequired,
    setScreenId: PropTypes.func.isRequired,
  };

  static defaultProps = {
    openedFrom: undefined,
    referralId: undefined,
  };

  replaceWithLoginModal = () => {
    const { openModal, close } = this.props;

    close(openModal(SHOW_MODAL_LOGIN));
  };

  buttonClickHandler = provider => {
    const { setScreenId, openedFrom, unauthState, referralId } = this.props;

    if (ANALYTIC_PROVIDERS_INDEX[provider]) {
      trackEvent(`Open screen ${ANALYTIC_PROVIDERS_INDEX[provider]}`);
    }

    if (provider === 'phone') {
      setScreenId('PNONE_SCREEN_ID');
      setRegistrationData({ type: 'phone' });
    } else if (provider === 'email') {
      setScreenId('EMAIL_SCREEN_ID');
      setRegistrationData({ type: 'email' });
    } else {
      setRegistrationData({ type: 'oauth', referralId });

      if (openedFrom) {
        localStorage.setItem(REGISTRATION_OPENED_FROM_KEY, openedFrom);
      }

      localStorage.setItem(UNAUTH_STATE_KEY, JSON.stringify(unauthState));

      window.location = `/oauth/${provider}`;
    }
  };

  renderButtons = () => {
    const { featureToggles, t, i18n } = this.props;

    const buttons = [
      {
        enabled: true,
        name: 'phone',
        icon: 'phone',
        textColor: '#000',
        backgroundColor: '#fff',
        border: '1px solid #a5a7bd',
      },
      {
        enabled: featureToggles[FEATURE_EMAIL_REGISTRATION],
        name: 'email',
        icon: 'envelope',
        textColor: '#000',
        backgroundColor: '#fff',
        border: '1px solid #a5a7bd',
      },
      {
        enabled: featureToggles[FEATURE_OAUTH_GOOGLE],
        name: 'google',
        icon: 'google',
        textColor: '#000',
        backgroundColor: '#fff',
        border: '1px solid #a5a7bd',
      },
      {
        enabled: featureToggles[FEATURE_OAUTH_FACEBOOK],
        name: 'facebook',
        icon: 'facebook-symmetrical',
        textColor: '#fff',
        backgroundColor: '#415A94',
      },
      {
        enabled: featureToggles[FEATURE_OAUTH_APPLE],
        name: 'apple',
        icon: 'apple',
        textColor: '#fff',
        backgroundColor: '#000',
      },
    ].map(({ name, icon, enabled, textColor, backgroundColor, border }) =>
      enabled ? (
        <ContinueWithButton
          key={name}
          name={`registration__continue-with__${name.toLowerCase()}`}
          style={{
            color: textColor,
            backgroundColor,
            border,
          }}
          onClick={() => this.buttonClickHandler(name)}
        >
          <ProviderIcon name={icon} />
          <span
            dangerouslySetInnerHTML={{
              __html: i18n.exists(`modals.sign_up.oauth.providers.${name}`)
                ? t('modals.sign_up.oauth.continue_custom', {
                    name: t(`modals.sign_up.oauth.providers.${name}`),
                  })
                : t('modals.sign_up.oauth.continue', { name }),
            }}
          />
        </ContinueWithButton>
      ) : null
    );

    if (featureToggles[FEATURE_OAUTH_TELEGRAM]) {
      buttons.push(<TelegramLoginButton key="telegram" />);
    }

    return buttons;
  };

  render() {
    const { t } = this.props;

    return (
      <Wrapper>
        {this.renderButtons()}
        <TermsAgree />
        <SwitchWrapper>
          <SwitchText>{t('modals.sign_up.oauth.sign_in_text')}</SwitchText>
          <SwitchButton onClick={this.replaceWithLoginModal}>
            &nbsp;{t('modals.sign_up.oauth.sign_in')}
          </SwitchButton>
        </SwitchWrapper>
      </Wrapper>
    );
  }
}
