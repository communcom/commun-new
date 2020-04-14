import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, CloseButton } from '@commun/ui';
import { useTranslation } from 'shared/i18n';
import { getMobileAppUrl } from 'utils/mobile';
import { trackEvent } from 'utils/analytics';

const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 464px;
  padding: 0 16px;
  margin: 0 30px;
  background-color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  overflow-y: auto;
  border-radius: 25px;
`;

const Image = styled.img`
  width: 277px;
  max-width: 277px;
`;

const Title = styled.h1`
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 28px;
  line-height: 1;
  text-align: center;

  .highlight {
    line-height: 1;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const Text = styled.p`
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
`;

const AppLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.blue};
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const TextButton = styled.button.attrs({ type: 'button' })`
  margin-top: 20px;
  padding-bottom: 25px;
  font-weight: 600;
  font-size: 16px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  top: 15px;
  right: 15px;
`;

export default function OnboardingAppBanner({ openSignInModal, close }) {
  const { t } = useTranslation();

  function onClickContinue() {
    trackEvent('Click continue app 0.4.1');
  }

  function onClickSignIn() {
    trackEvent('Click log in 0.1');

    openSignInModal();
    close();
  }

  return (
    <Wrapper>
      <Image src="/images/onboarding/landing/mobile/app-banner.png" alt="" />
      <Title
        dangerouslySetInnerHTML={{
          __html: t('modals.onboarding_app_banner.title'),
        }}
      />
      <Text>{t('modals.onboarding_app_banner.text')}</Text>
      <AppLink
        href={getMobileAppUrl()}
        name="onboarding-app-banner__app-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClickContinue}
      >
        {t('modals.onboarding_app_banner.continue')}
      </AppLink>
      <TextButton name="onboarding-app-banner__login" onClick={onClickSignIn}>
        {t('modals.onboarding_app_banner.sign_in')}
      </TextButton>
      <CloseButtonStyled size={18} isBig onClick={close} />
    </Wrapper>
  );
}

OnboardingAppBanner.propTypes = {
  // eslint-disable-next-line react/require-default-props
  modalRef: PropTypes.shape({ current: PropTypes.any }),

  openSignInModal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};
