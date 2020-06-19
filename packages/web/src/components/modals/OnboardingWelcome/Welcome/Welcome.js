import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';

import {
  Banner,
  Buttons,
  ButtonStyled,
  CarouselBody,
  Description,
  Title,
  Wrapper,
} from '../common.styled';

const BannerStyled = styled(Banner)`
  width: 294px;
  margin-top: -30px;
`;

const TitleStyled = styled(Title)`
  margin-top: 24px;
`;

export default function Welcome({ next }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/welcome.png" />

        <TitleStyled
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.welcome.title') }}
        />

        <Description
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.welcome.title') }}
        />
      </CarouselBody>
      <Buttons>
        <ButtonStyled primary autoFocus onClick={next}>
          {t('common.next')}
        </ButtonStyled>
      </Buttons>
    </Wrapper>
  );
}

Welcome.propTypes = {
  next: PropTypes.func.isRequired,
};
