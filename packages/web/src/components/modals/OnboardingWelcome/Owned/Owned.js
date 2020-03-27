import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { useTranslation } from 'shared/i18n';
import {
  Wrapper,
  CarouselBody,
  Banner,
  Title,
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
  const { t } = useTranslation();

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

        <Title dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.owned.title') }} />

        <DescriptionStyled
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.owned.description') }}
        />
      </CarouselBody>
      <Buttons>
        <ButtonStyled id="gtm-sign-up-invite" primary autoFocus onClick={onClickSignUp}>
          {t('modals.onboarding_welcome.owned.sign_up')} <RewardIcon />
        </ButtonStyled>
        <ButtonStyled onClick={onClickSignIn}>
          {t('modals.onboarding_welcome.owned.sign_in')}
        </ButtonStyled>
      </Buttons>
    </Wrapper>
  );
}

Owned.propTypes = {
  close: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
};
