import React, { useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card } from '@commun/ui';
import { getMobileAppUrl } from 'utils/mobile';
import { trackEvent } from 'utils/analytics';

const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 464px;
  padding: 0 16px;
  margin: 0 30px;
  background-color: #fff;
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
`;

const HighlightedWord = styled.span`
  line-height: 1;
  color: ${({ theme }) => theme.colors.blue};
`;

const Desc = styled.p`
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

export default function OnboardingAppBanner({ openSignInModal, modalRef }) {
  useImperativeHandle(modalRef, () => ({
    canClose: () => false,
  }));

  function onClickContinue() {
    trackEvent('click mobile continue app 1');
  }

  function onClickSignIn() {
    trackEvent('click mobile sign in 1');

    openSignInModal();
  }

  return (
    <Wrapper>
      <Image src="/images/onboarding/landing/mobile/app-banner.png" alt="" />
      <Title>
        <HighlightedWord>Commun</HighlightedWord> is better on the
        <HighlightedWord> App</HighlightedWord>
      </Title>
      <Desc>Try it now and get points</Desc>
      <AppLink
        href={getMobileAppUrl()}
        name="onboarding-app-banner__app-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClickContinue}
      >
        Continue with App
      </AppLink>
      <TextButton name="onboarding-app-banner__login" onClick={onClickSignIn}>
        Sign in
      </TextButton>
    </Wrapper>
  );
}

OnboardingAppBanner.propTypes = {
  // eslint-disable-next-line react/require-default-props
  modalRef: PropTypes.shape({ current: PropTypes.any }),

  openSignInModal: PropTypes.func.isRequired,
};
