import React from 'react';
import styled from 'styled-components';

import MobileAppsLinksBlock from 'components/common/MobileAppsLinksBlock';
import { Content, CarouselBody, Banner, Title, Blue, Description } from '../common.styled';

const ContentStyled = styled(Content)`
  margin-bottom: 50px;
`;

const MobileAppsLinksBlockStyled = styled(MobileAppsLinksBlock).attrs({ size: '50' })`
  flex-flow: row-reverse;

  & > :not(:last-child) {
    margin-left: 20px;
  }
`;

export default function Download() {
  return (
    <ContentStyled>
      <CarouselBody>
        <Banner src="/images/onboarding/download-2.png" />

        <Title>
          <Blue>Download App</Blue>
          <br />
          Double your points
        </Title>

        <Description>
          Right after you authorize in the App
          <br />
          We double your welcome points
        </Description>
      </CarouselBody>
      <MobileAppsLinksBlockStyled />
    </ContentStyled>
  );
}
