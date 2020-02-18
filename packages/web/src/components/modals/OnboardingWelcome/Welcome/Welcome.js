import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Wrapper,
  CarouselBody,
  Banner,
  Title,
  Blue,
  Description,
  Buttons,
  ButtonStyled,
} from '../common.styled';

const BannerStyled = styled(Banner)`
  width: 294px;
  margin-top: -30px;
`;

const TitleStyled = styled(Title)`
  margin-top: 24px;
`;

export default function Welcome({ next }) {
  return (
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/welcome.png" />

        <TitleStyled>
          Welcome
          <br />
          to <Blue>Commun /</Blue>
        </TitleStyled>

        <Description>
          Blockchain-based social network where you get <Blue>rewards</Blue> for posts, comments and
          likes
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

Welcome.propTypes = {
  next: PropTypes.func.isRequired,
};
