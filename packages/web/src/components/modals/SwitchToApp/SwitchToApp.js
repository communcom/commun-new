import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';
import { IOS_STORE_APP_URL, ANDROID_STORE_APP_URL } from 'shared/constants';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;

  & > * {
    pointer-events: initial;
  }
`;

const raiseUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Popup = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 15px 35px;
  border-radius: 25px 25px 0 0;
  background: #fff;
  box-shadow: 0 0 30px 1px rgba(0, 0, 0, 0.12);
  animation: ${raiseUp} 0.35s;
`;

const LogoIcon = styled(Icon).attrs({ name: 'commun' })`
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.blue};
`;

const Title = styled.span`
  margin-bottom: 6px;
  line-height: 33px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.p`
  margin-bottom: 40px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray};
`;

const ButtonLink = styled.a`
  display: block;
  width: 100%;
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 50px;
  font-size: 15px;
  font-weight: bold;

  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const SignUpButton = styled(ButtonStyled)`
  background: none !important;
`;

export default function SwitchToApp({ openLoginModal }) {
  const ua = window.navigator.userAgent;
  const isIos = /\b(?:iphone|ipod|ipad|ios)\b/.test(ua.toLowerCase());
  const appUrl = isIos ? IOS_STORE_APP_URL : ANDROID_STORE_APP_URL;

  return (
    <Wrapper>
      <Popup>
        <LogoIcon />
        <Title>Commun is Better on the App</Title>
        <Description>
          Designed for the best experience of self-governed social network on your mobile
        </Description>
        <ButtonLink href={appUrl}>
          <ButtonStyled primary>Switch to the App</ButtonStyled>
        </ButtonLink>
        <SignUpButton onClick={openLoginModal}>Sign in</SignUpButton>
      </Popup>
    </Wrapper>
  );
}

SwitchToApp.propTypes = {
  openLoginModal: PropTypes.func.isRequired,
};

SwitchToApp.getInitialProps = () => ({
  noBackgroundShadow: true,
});
