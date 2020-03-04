/* eslint-disable consistent-return */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import {
  Wrapper,
  RightWrapper,
  Title,
  MobileAppLink,
  Image,
  CoinIcon,
  TextButton,
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
  appLink,
  sections,
  isMountAnimationStarted,
  isUnmountAnimationStarted,
  openSignInModal,
  startUnmountAnimation,
}) {
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
    e.preventDefault();
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
    e.preventDefault();
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
        <Title>{section.title}</Title>
        <MobileAppLink
          href={appLink}
          name="onboarding-banner__sign-up"
          target="_blank"
          rel="noopener noreferrer"
        >
          Start now and get points
          <CoinIcon />
        </MobileAppLink>
        <TextButton name="onboarding-banner__sign-in" onClick={openSignInModal}>
          Sign in
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
  appLink: PropTypes.string,
  sections: PropTypes.arrayOf(PropTypes.object),
  isMountAnimationStarted: PropTypes.bool,
  isUnmountAnimationStarted: PropTypes.bool,

  openSignInModal: PropTypes.func.isRequired,
  startUnmountAnimation: PropTypes.func.isRequired,
};

MobileSlides.defaultProps = {
  activeIndex: 0,
  appLink: undefined,
  sections: [],
  isMountAnimationStarted: false,
  isUnmountAnimationStarted: false,
};

export default MobileSlides;
