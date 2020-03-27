import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'shared/i18n';

import {
  Content,
  CarouselBody,
  Banner,
  Title,
  Description,
  Buttons,
  ButtonStyled,
} from '../common.styled';

export default function Share({ next }) {
  const { t } = useTranslation();

  return (
    <Content>
      <CarouselBody>
        <Banner src="/images/onboarding/share.png" />

        <Title
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_registration.share.title') }}
        />

        <Description
          dangerouslySetInnerHTML={{
            __html: t('modals.onboarding_registration.share.description'),
          }}
        />
      </CarouselBody>
      <Buttons>
        <ButtonStyled primary onClick={next}>
          {t('modals.onboarding_registration.share.share_link')}
        </ButtonStyled>
      </Buttons>
    </Content>
  );
}

Share.propTypes = {
  next: PropTypes.func.isRequired,
};
