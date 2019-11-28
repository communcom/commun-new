import React from 'react';
import PropTypes from 'prop-types';

import {
  Wrapper,
  CarouselBody,
  Banner,
  Title,
  Strong,
  Description,
  Buttons,
  ButtonStyled,
} from '../common.styled';

export default function Monetize({ next }) {
  return (
    <Wrapper>
      <CarouselBody>
        <Banner src="/images/onboarding/monetize.png" />

        <Title>
          <Strong>Monetize</Strong>
          <br />
          your socializing
        </Title>

        <Description>
          Every post, share, comment
          <br />
          or like is rewarded
        </Description>
      </CarouselBody>
      <Buttons>
        <ButtonStyled primary onClick={next}>
          Next
        </ButtonStyled>
      </Buttons>
    </Wrapper>
  );
}

Monetize.propTypes = {
  next: PropTypes.func.isRequired,
};
