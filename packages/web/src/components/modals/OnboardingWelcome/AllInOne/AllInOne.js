import React from 'react';
import PropTypes from 'prop-types';

import {
  CarouselBody,
  Banner,
  Title,
  Strong,
  Description,
  Buttons,
  ButtonStyled,
} from '../common.styled';

export default function AllInOne({ next }) {
  return (
    <>
      <CarouselBody>
        <Banner src="/images/onboarding/all-in-one.png" />

        <Title>
          <Strong>All-in-one</Strong>
          <br />
          social network
        </Title>

        <Description>
          Create, share, and evaluate content
          <br />
          Decide yourself what deserves the attention
        </Description>
      </CarouselBody>
      <Buttons>
        <ButtonStyled primary onClick={next}>
          Next
        </ButtonStyled>
      </Buttons>
    </>
  );
}

AllInOne.propTypes = {
  next: PropTypes.func.isRequired,
};
