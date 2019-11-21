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

export default function Share({ next }) {
  return (
    <Content>
      <CarouselBody>
        <Banner src="/images/onboarding/share.png" />

        <Title>
          <Blue>Share</Blue> with friends
          <br />
          Double your points
        </Title>

        <Description>
          You will also receive 5% of purchases
          <br />
          of friends who came via your link
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

Share.propTypes = {
  next: PropTypes.func.isRequired,
};
