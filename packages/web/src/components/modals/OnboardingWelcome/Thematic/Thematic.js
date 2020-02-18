import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Wrapper,
  CarouselBody,
  Banner,
  Title,
  Blue,
  Strong,
  Description,
  Buttons,
  ButtonStyled,
} from '../common.styled';

const BannerStyled = styled(Banner)`
  width: 250px;
`;

export default function Thematic({ next }) {
  return (
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/all-in-one.png" />

        <Title>
          <Strong>
            <Blue>Thematic</Blue>
          </Strong>
          <br />
          communities
        </Title>

        <Description>
          Choose communities of interest and <br />
          be <Blue>rewarded</Blue> for your actions
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

Thematic.propTypes = {
  next: PropTypes.func.isRequired,
};
