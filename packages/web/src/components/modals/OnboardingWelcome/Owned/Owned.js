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
  width: 260px;
  margin-top: -10px;
`;

const DescriptionStyled = styled(Description)`
  margin-bottom: 30px !important;
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
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/owned.png" />

        <Title>
          <Strong>Owned</Strong> by users
        </Title>

        <DescriptionStyled>
          Communities has no single owner
          <br />
          and fully belongs to its members
        </DescriptionStyled>
      </CarouselBody>
      <Buttons>
        <ButtonStyled id="gtm-sign-up-invite" primary onClick={onClickSignUp}>
          Sign up
        </ButtonStyled>
        <ButtonStyled onClick={onClickSignIn}>Sign in</ButtonStyled>
      </Buttons>
    </Wrapper>
  );
}

Owned.propTypes = {
  close: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
};
