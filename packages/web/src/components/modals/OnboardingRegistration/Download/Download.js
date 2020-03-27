import React from 'react';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';
import MobileAppsLinksBlock from 'components/common/MobileAppsLinksBlock';
import { Content, CarouselBody, Banner, Title, Description } from '../common.styled';

const ContentStyled = styled(Content)`
  margin-bottom: 50px;
`;

const MobileAppsLinksBlockStyled = styled(MobileAppsLinksBlock).attrs({ size: '50' })`
  flex-flow: row-reverse;

  & > :not(:last-child) {
    margin-right: 0;
    margin-left: 20px;
  }
`;

export default function Download() {
  const { t } = useTranslation();

  return (
    <ContentStyled>
      <CarouselBody>
        <Banner src="/images/onboarding/download-2.png" />

        <Title
          dangerouslySetInnerHTML={{ __html: t('modals.onboarding_registration.download.title') }}
        />

        <Description
          dangerouslySetInnerHTML={{
            __html: t('modals.onboarding_registration.download.description'),
          }}
        />
      </CarouselBody>
      <MobileAppsLinksBlockStyled />
    </ContentStyled>
  );
}
