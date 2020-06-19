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
  width: 250px;
`;

export default function Thematic({ next }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <CarouselBody>
        <BannerStyled src="/images/onboarding/all-in-one.png" />

        <Title
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.thematic.title') }}
        />

        <Description
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_welcome.thematic.description') }}
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

Thematic.propTypes = {
  next: PropTypes.func.isRequired,
};
