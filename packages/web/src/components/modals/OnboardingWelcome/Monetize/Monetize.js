import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
  width: 250px;
`;

export default function Monetize({ next }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/monetize.png" />

        <Title
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.monetize.title') }}
        />

        <Description
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.monetize.description') }}
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

Monetize.propTypes = {
  next: PropTypes.func.isRequired,
};
