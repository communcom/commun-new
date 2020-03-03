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
    background-color: ${({ theme, type, isNeedShowOnboardingBanner }) => {
      if (type === LAYOUT_TYPE_1PANE || isNeedShowOnboardingBanner) {
        return '#ffffff';
      }

      return theme.colors.lightGrayBlue;
    }};
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
  loggedUserId,
  openAppBannerModal,
}) {
  const [isClosed, setIsOnboardingBannerClosed] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageYOffset, setPageYOffset] = useState(0);
  const [pageYOffsetForOnboardingAppBanner, setPageYOffsetForOnboardingAppBanner] = useState(0);
  const [isNeedShowOnboardingAppBanner, setIsNeedShowOnboardingAppBanner] = useState(true);

  const router = useRouter();
  const isNeedShowOnboardingBanner =
    !loggedUserId && !isAutoLogging && (router.route === '/home' || router.route === '/feed');
  const isNeedDisableHeaderShadow =
    pageYOffset < ONBOARDING_BANNER_HEIGHT && isNeedShowOnboardingBanner;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isNeedShowOnboardingBanner) {
      if (!pageHeight) {
        setPageHeight(window.innerHeight);
      }

      if (isMobile && isClosed && isNeedShowOnboardingAppBanner) {
        const necessaryScrollStep = pageHeight * 2;

        if (!pageYOffsetForOnboardingAppBanner) {
          setPageYOffsetForOnboardingAppBanner(necessaryScrollStep + window.pageYOffset);
        }

        if (pageYOffsetForOnboardingAppBanner && pageYOffset >= pageYOffsetForOnboardingAppBanner) {
          setIsNeedShowOnboardingAppBanner(false);
          openAppBannerModal();
        }
      }

      const updatePageHeight = throttle(() => {
        setPageHeight(window.innerHeight);
      }, 200);

      const updatePageYOffset = throttle(() => {
        setPageYOffset(window.pageYOffset);
      }, 200);

      window.addEventListener('scroll', updatePageYOffset);
      window.addEventListener('resize', updatePageHeight);

      return () => {
        window.removeEventListener('scroll', updatePageYOffset);
        window.removeEventListener('resize', updatePageHeight);
        updatePageYOffset.cancel();
        updatePageHeight.cancel();
      };
    }
  }, [
    pageHeight,
    isMobile,
    isClosed,
    isNeedShowOnboardingBanner,
    isNeedShowOnboardingAppBanner,
    pageYOffset,
    pageYOffsetForOnboardingAppBanner,
    openAppBannerModal,
  ]);

  return (
    <>
      <GlobalStyles type={type} isNeedShowOnboardingBanner={isNeedShowOnboardingBanner} />
      <Wrapper>
        <Header
          communityId={pageProps.communityId}
          noShadow={type === LAYOUT_TYPE_1PANE || isNeedDisableHeaderShadow}
          isNeedToHideSignUp={isNeedDisableHeaderShadow}
        />
        {isNeedShowOnboardingBanner ? (
          <OnboardingBanner
            isClosed={isClosed}
            isNeedStopAnimation={!isMobile && !isNeedDisableHeaderShadow}
            onCloseClick={setIsOnboardingBannerClosed}
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
  loggedUserId: PropTypes.string,

  openAppBannerModal: PropTypes.func.isRequired,
};

Layout.defaultProps = {
  type: undefined,
  isMobile: false,
  isAutoLogging: false,
  loggedUserId: null,
};
