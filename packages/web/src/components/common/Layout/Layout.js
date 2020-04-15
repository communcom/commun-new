import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import is from 'styled-is';
import { useRouter } from 'next/router';
import throttle from 'lodash.throttle';

import { MainContainer, up } from '@commun/ui';
import Header from 'components/common/Header';
import SideBar from 'components/common/SideBar';
import ScrollFix from 'components/common/ScrollFix';
import OnboardingBanner from 'components/OnboardingBanner';

export const LAYOUT_TYPE_1PANE = '1pane';

const ONBOARDING_BANNER_HEIGHT = 583;

const GlobalStyles = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme, type, isNeedShowOnboardingBanner }) => {
      if (type === LAYOUT_TYPE_1PANE || isNeedShowOnboardingBanner) {
        return theme.colors.white;
      }

      return theme.colors.lightGrayBlue;
    }};
  }

  a {
    color: ${({ theme }) => theme.colors.blue};
  }

  button {
    color: ${({ theme }) => theme.colors.black};
  }
`;

const Wrapper = styled.div``;

const ScrollFixStyled = styled(ScrollFix)`
  display: flex;

  @media (max-width: 768px) {
    width: 100% !important;
  }

  ${is('withOnboardingBanner')`
    position: relative;
    z-index: 2;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};

    ${up.tablet} {
      padding-top: 56px;
      border-radius: 64px 64px 0 0;
    }
  `};
`;

const MainContainerStyled = styled(MainContainer)`
  flex-direction: row;
`;

export default function Layout({
  pageProps,
  type,
  children,
  isMobile,
  isAutoLogging,
  isOnboardingBannerClosed,
  loggedUserId,
  openAppBannerModal,
  closeOnboardingBanner,
}) {
  const [pageYOffset, setPageYOffset] = useState(0);

  const router = useRouter();
  const isNeedShowOnboardingBanner =
    !loggedUserId && !isAutoLogging && (router.route === '/home' || router.route === '/feed');
  const isNeedDisableHeaderShadow =
    pageYOffset < ONBOARDING_BANNER_HEIGHT && isNeedShowOnboardingBanner;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isNeedShowOnboardingBanner) {
      const updatePageYOffset = throttle(() => {
        setPageYOffset(window.pageYOffset);
      }, 200);

      window.addEventListener('scroll', updatePageYOffset);

      return () => {
        window.removeEventListener('scroll', updatePageYOffset);
        updatePageYOffset.cancel();
      };
    }
  }, [isMobile, isNeedShowOnboardingBanner, pageYOffset, openAppBannerModal]);

  return (
    <>
      <GlobalStyles type={type} isNeedShowOnboardingBanner={isNeedShowOnboardingBanner} />
      <Wrapper>
        <Header
          communityId={pageProps.communityId}
          noShadow={type === LAYOUT_TYPE_1PANE || isNeedDisableHeaderShadow}
        />
        {isNeedShowOnboardingBanner ? (
          <OnboardingBanner
            isClosed={isOnboardingBannerClosed}
            isNeedStopAnimation={!isMobile && !isNeedDisableHeaderShadow}
            onCloseClick={closeOnboardingBanner}
          />
        ) : null}
        <ScrollFixStyled withOnboardingBanner={isNeedShowOnboardingBanner}>
          <MainContainerStyled noVerticalPadding={type === LAYOUT_TYPE_1PANE}>
            {type !== LAYOUT_TYPE_1PANE ? <SideBar /> : null}
            {children}
          </MainContainerStyled>
        </ScrollFixStyled>
      </Wrapper>
    </>
  );
}

Layout.propTypes = {
  pageProps: PropTypes.object.isRequired,
  type: PropTypes.string,
  isMobile: PropTypes.bool,
  isAutoLogging: PropTypes.bool,
  isOnboardingBannerClosed: PropTypes.bool,
  loggedUserId: PropTypes.string,

  openAppBannerModal: PropTypes.func.isRequired,
  closeOnboardingBanner: PropTypes.func.isRequired,
};

Layout.defaultProps = {
  type: undefined,
  isMobile: false,
  isAutoLogging: false,
  isOnboardingBannerClosed: false,
  loggedUserId: null,
};
