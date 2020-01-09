import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

const BannerStyled = styled(Banner)`
  width: 250px;
`;

export default function Monetize({ next }) {
  return (
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/monetize.png" />

        <Title>
          <Strong>Monetize</Strong>
          <br />
          your socializing
        </Title>

        <Description>
          Create posts, comments, like
          <br />
          and get Community Points
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
