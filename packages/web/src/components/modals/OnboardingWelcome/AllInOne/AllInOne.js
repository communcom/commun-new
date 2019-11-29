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

export default function AllInOne({ next }) {
  return (
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/all-in-one.png" />

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
    </Wrapper>
  );
}

AllInOne.propTypes = {
  next: PropTypes.func.isRequired,
};
