import React from 'react';
import PropTypes from 'prop-types';

import {
  Wrapper,
  RightWrapper,
  Title,
  Description,
  ButtonStyled,
  Image,
  CoinIcon,
} from '../common';

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
        <ButtonStyled primary name="onboarding-banner__sign-up" onClick={openSignUpModal}>
          Get started and get 30 Points
          <CoinIcon />
        </ButtonStyled>
      </RightWrapper>
      <Image style={section.image.style} src={section.image.scr} alt="" />
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
