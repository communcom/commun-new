import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectFeatureToggles } from '@flopflip/react-redux';

import { Icon } from '@commun/icons';

import {
  FEATURE_OAUTH_GOOGLE,
  FEATURE_OAUTH_FACEBOOK,
  FEATURE_OAUTH_APPLE,
} from 'shared/featureFlags';
import { setRegistrationData } from 'utils/localStore';
import { SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';

import TermsAgree from '../TermsAgree';

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
`;

const ProviderName = styled.span`
  text-transform: capitalize;
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

@injectFeatureToggles([FEATURE_OAUTH_GOOGLE, FEATURE_OAUTH_FACEBOOK, FEATURE_OAUTH_APPLE])
export default class Oauth extends PureComponent {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    featureToggles: PropTypes.object.isRequired,
    setScreenId: PropTypes.func.isRequired,
  };

  replaceWithLoginModal = () => {
    const { openModal, close } = this.props;

    close(openModal(SHOW_MODAL_LOGIN));
  };

  buttonClickHandler = provider => {
    const { setScreenId } = this.props;

    if (provider === 'phone') {
      setScreenId('PNONE_SCREEN_ID');
      setRegistrationData({ type: 'phone' });
    } else {
      setRegistrationData({ type: 'oauth' });
      window.location = `/oauth/${provider}`;
    }
  };

  renderButtons = () => {
    const { featureToggles } = this.props;

    return [
      {
        enabled: true,
        name: 'phone',
        icon: 'phone',
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
          style={{
            color: textColor,
            backgroundColor,
            border,
          }}
          onClick={() => this.buttonClickHandler(name)}
        >
          <ProviderIcon name={icon} />
          Continue with <ProviderName>&nbsp;{name}</ProviderName>
        </ContinueWithButton>
      ) : null
    );
  };

  render() {
    return (
      <Wrapper>
        {this.renderButtons()}
        <TermsAgree />
        <SwitchWrapper>
          <SwitchText>Do you have account?</SwitchText>
          <SwitchButton onClick={this.replaceWithLoginModal}>&nbsp;Sign in</SwitchButton>
        </SwitchWrapper>
      </Wrapper>
    );
  }
}
