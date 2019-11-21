import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  CarouselBody,
  Banner,
  Title,
  Strong,
  Description,
  Buttons,
  ButtonStyled,
} from '../common.styled';

const DescriptionStyled = styled(Description)`
  margin-bottom: 30px;
`;

export default function Owned({ close, openLoginModal, openSignUpModal }) {
  async function onClickSignIn() {
    await close();
    openLoginModal();
  }

  async function onClickSignUp() {
    await close();
    openSignUpModal();
  }

  return (
    <>
      <CarouselBody>
        <Banner src="/images/onboarding/owned.png" />

        <Title>
          <Strong>Owned</Strong> by users
        </Title>

        <DescriptionStyled>
          Commun has no single owner and
          <br />
          fully belongs only to its members
        </DescriptionStyled>
      </CarouselBody>
      <Buttons>
        <ButtonStyled primary onClick={onClickSignUp}>
          Sign up
        </ButtonStyled>
        <ButtonStyled onClick={onClickSignIn}>Sign in</ButtonStyled>
      </Buttons>
    </>
  );
}

Owned.propTypes = {
  close: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
};
