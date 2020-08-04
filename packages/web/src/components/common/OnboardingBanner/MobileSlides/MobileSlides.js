/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isNil from 'ramda/src/isNil';

import { useTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';

import {
  CoinIcon,
  Image,
  MobileAppButton,
  RightWrapper,
  TextButton,
  Title,
  Wrapper,
} from '../common';

const images = [
  {
    src: '/images/onboarding/landing/mobile/first.png',
  },
  {
    src: '/images/onboarding/landing/mobile/second.png',
    style: {
      top: '-20px',
    },
  },
  {
    src: '/images/onboarding/landing/mobile/third.png',
    style: {
      height: 247,
      top: '-5px',
    },
  },
];

const MIN_MOBILE_SWAP_LENGTH = 75;

function MobileSlides({
  activeIndex,
  sections,
  isMountAnimationStarted,
  isUnmountAnimationStarted,
  openLoginModal,
  openSignUpModal,
  startUnmountAnimation,
}) {
  const { t } = useTranslation();
  const section = sections[activeIndex];

  const [xStart, setXStart] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function onTouchMove(e) {
      e.preventDefault();
    }

    const wrapper = wrapperRef.current;

    if (wrapper) {
      wrapper.addEventListener('touchmove', onTouchMove, {
        passive: false,
      });

      return () => {
        wrapper.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, []);

  function onTouchStart(e) {
    e.stopPropagation();
    const { changedTouches } = e;

    if (window.innerWidth > 768) {
      return;
    }

    if (
      changedTouches.length !== 1 ||
      xStart !== null ||
      isUnmountAnimationStarted ||
      isMountAnimationStarted
    ) {
      return;
    }

    setXStart(changedTouches[0].clientX);
  }

  function onTouchEnd(e) {
    e.stopPropagation();

    if (
      xStart === null ||
      !e.changedTouches.length ||
      isUnmountAnimationStarted ||
      isMountAnimationStarted
    ) {
      return;
    }

    const xEnd = e.changedTouches[0].clientX;
    const xDiff = xStart - xEnd;
    let nextIndex;

    if (Math.abs(xDiff) > MIN_MOBILE_SWAP_LENGTH) {
      if (xDiff < 0) {
        nextIndex = activeIndex === 0 ? sections.length - 1 : activeIndex - 1;
      } else if (xDiff > 0) {
        nextIndex = activeIndex === sections.length - 1 ? 0 : activeIndex + 1;
      }

      if (!isNil(nextIndex)) {
        startUnmountAnimation(nextIndex);
      }
    }

    setXStart(null);
  }

  if (!section) {
    return null;
  }

  function onClickSignUp() {
    trackEvent(`Click get started 0.1.${activeIndex + 1}`);

    openSignUpModal();
  }

  function onClickLogin() {
    openLoginModal();
  }

  return (
    <Wrapper
      ref={wrapperRef}
      isMountAnimationStarted={isMountAnimationStarted}
      isUnmountAnimationStarted={isUnmountAnimationStarted}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <RightWrapper
        isMountAnimationStarted={isMountAnimationStarted}
        isUnmountAnimationStarted={isUnmountAnimationStarted}
      >
        <Title
          dangerouslySetInnerHTML={{
            __html: t(`components.onboarding.mobileSlides.${section.localeKey}.title`),
          }}
        />
        <MobileAppButton name="onboarding-banner__sign-up" onClick={onClickSignUp}>
          {t('components.onboarding.sign_up-mobile')}
          <CoinIcon />
        </MobileAppButton>
        <TextButton name="onboarding-banner__sign-in" onClick={onClickLogin}>
          {t('common.sign_in')}
        </TextButton>
      </RightWrapper>
      {images.map(({ src, style }, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          style={style}
          isActive={activeIndex === index}
          aria-hidden={activeIndex !== index}
        />
      ))}
    </Wrapper>
  );
}

MobileSlides.propTypes = {
  activeIndex: PropTypes.number,
  sections: PropTypes.arrayOf(PropTypes.object),
  isMountAnimationStarted: PropTypes.bool,
  isUnmountAnimationStarted: PropTypes.bool,

  openLoginModal: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
  startUnmountAnimation: PropTypes.func.isRequired,
};

MobileSlides.defaultProps = {
  activeIndex: 0,
  sections: [],
  isMountAnimationStarted: false,
  isUnmountAnimationStarted: false,
};

export default MobileSlides;
