import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
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

const RewardIcon = styled(Icon).attrs({ name: 'reward' })`
  margin: -3px -32px 0 6px;
  width: 32px;
  height: 30px;
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
          Communities have no single owner
          <br />
          and fully belong to its members
        </DescriptionStyled>
      </CarouselBody>
      <Buttons>
        <ButtonStyled id="gtm-sign-up-invite" primary autoFocus onClick={onClickSignUp}>
          Start and get 30 Points <RewardIcon />
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
