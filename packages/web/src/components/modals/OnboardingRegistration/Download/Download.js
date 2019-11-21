import React from 'react';
import PropTypes from 'prop-types';

import {
  Content,
  CarouselBody,
  Banner,
  Title,
  Blue,
  Description,
  Buttons,
  ButtonStyled,
} from '../common.styled';

export default function Download({ next }) {
  return (
    <Content>
      <CarouselBody>
        <Banner src="/images/onboarding/download-3.png" />

        <Title>
          <Blue>Download App</Blue>
          <br />
          Triple your points
        </Title>

        <Description>
          Right after you authorize in the App
          <br />
          We triple your welcome points
        </Description>
      </CarouselBody>
      <Buttons>
        <ButtonStyled primary onClick={next}>
          Share link
        </ButtonStyled>
      </Buttons>
    </Content>
  );
}

Download.propTypes = {
  next: PropTypes.func.isRequired,
};
