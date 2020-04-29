import React, { useRef, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, CloseButton, up } from '@commun/ui';
import { userType } from 'types';
import { useTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';

import OnboardingCarouselDots from 'components/common/OnboardingCarouselDots';
import OnboardingCarousel from 'components/common/OnboardingCarousel';
import { replaceRouteAndAddQuery } from 'utils/router';
import Communities from './Communities';
// import Share from './Share';
import Download from './Download';

export const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 480px;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: auto;

  ${up.mobileLandscape} {
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  }

  ${up.tablet} {
    height: 618px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 25px 10px;
  min-height: 30px;
  z-index: 1;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Right = styled.div`
  z-index: 1;
`;

const CloseButtonStyled = styled(CloseButton)`
  display: none;

  width: 30px;
  height: 30px;

  ${up.mobileLandscape} {
    display: flex;
  }
`;

const Skip = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  cursor: pointer;
`;

export const BackButton = styled(CloseButton).attrs({ isBack: true })``;

export default function OnboardingRegistration({
  user,
  modalRef,
  isSignUp,
  isMobile,
  afterOauth,
  close,
}) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef();

  // function onBack() {
  //   close();
  // }

  function onChangeActive(index) {
    setActiveIndex(index);
  }

  function onChangeLoading(loading) {
    setIsLoading(loading);
  }

  function onFinish() {
    // for analytics
    replaceRouteAndAddQuery({ step: 'thankyou' });

    trackEvent('onboarding completion 1');

    close(user);
  }

  function onNextClick() {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  }

  useImperativeHandle(modalRef, () => ({
    canClose: () => false,
  }));

  const steps = afterOauth
    ? [<Download key="download" />]
    : [
        <Communities
          key="communities"
          isSignUp={isSignUp}
          currentUserId={user?.userId}
          close={close}
          onChangeLoading={onChangeLoading}
        />,
        // <Share />,
        <Download key="download" />,
      ];

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <Wrapper>
      <Header>
        <Left>{/* {activeIndex > 0 ? null : <BackButton onClick={onBack} />} */}</Left>
        {steps.length > 1 ? (
          <OnboardingCarouselDots count={steps.length} activeIndex={activeIndex} />
        ) : null}
        {(isSignUp || isLastStep) && !isLoading && !isMobile ? (
          <Right>
            <CloseButtonStyled onClick={onFinish} />
          </Right>
        ) : null}
        {(isSignUp || isLastStep) && !isLoading && isMobile ? (
          <Right>
            <Skip onClick={onNextClick}>{t('common.skip')}</Skip>
          </Right>
        ) : null}
      </Header>
      <OnboardingCarousel
        ref={carouselRef}
        activeIndex={activeIndex}
        onChangeActive={onChangeActive}
        onFinish={onFinish}
      >
        {steps}
      </OnboardingCarousel>
    </Wrapper>
  );
}

OnboardingRegistration.propTypes = {
  user: userType.isRequired,
  // eslint-disable-next-line react/require-default-props
  modalRef: PropTypes.shape({ current: PropTypes.any }),
  isSignUp: PropTypes.bool,
  isMobile: PropTypes.bool,
  afterOauth: PropTypes.bool,

  close: PropTypes.func.isRequired,
};

OnboardingRegistration.defaultProps = {
  isSignUp: false,
  isMobile: false,
  afterOauth: false,
};
