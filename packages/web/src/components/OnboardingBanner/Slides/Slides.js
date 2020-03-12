import React from 'react';
import PropTypes from 'prop-types';

import { trackEvent } from 'utils/analytics';
import {
  Wrapper,
  RightWrapper,
  Title,
  Description,
  ButtonStyled,
  Image,
  CoinIcon,
} from '../common';

const images = [
  {
    src: '/images/onboarding/landing/first.png',
    style: {
      width: 403,
      margin: '0 19px',
    },
  },
  {
    src: '/images/onboarding/all-in-one.png',
  },
  {
    src: '/images/onboarding/landing/third.png',
  },
];

function Slides({
  activeIndex,
  sections,
  isMountAnimationStarted,
  isUnmountAnimationStarted,
  openSignUpModal,
}) {
  const section = sections[activeIndex];

  if (!section) {
    return null;
  }

  function onClick() {
    openSignUpModal();

    trackEvent(`Click get started 0.1.${activeIndex + 1}`);
  }

  return (
    <Wrapper
      isMountAnimationStarted={isMountAnimationStarted}
      isUnmountAnimationStarted={isUnmountAnimationStarted}
    >
      <RightWrapper
        isMountAnimationStarted={isMountAnimationStarted}
        isUnmountAnimationStarted={isUnmountAnimationStarted}
      >
        <Title>{section.title}</Title>
        <Description>{section.desc}</Description>
        <ButtonStyled primary name="onboarding-banner__sign-up" onClick={onClick}>
          Get started and get 30 Points
          <CoinIcon />
        </ButtonStyled>
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

Slides.propTypes = {
  activeIndex: PropTypes.number,
  sections: PropTypes.arrayOf(PropTypes.object),
  isMountAnimationStarted: PropTypes.bool,
  isUnmountAnimationStarted: PropTypes.bool,

  openSignUpModal: PropTypes.func.isRequired,
};

Slides.defaultProps = {
  activeIndex: 0,
  sections: [],
  isMountAnimationStarted: false,
  isUnmountAnimationStarted: false,
};

export default Slides;
