import React from 'react';
import styled from 'styled-components';

import { InvisibleText } from '@commun/ui';

import { IOS_STORE_APP_URL, ANDROID_STORE_APP_URL } from 'shared/constants';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 10px;

  & > :not(:last-child) {
    margin-right: 20px;
  }
`;

const AppLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Badge = styled.img`
  height: 40px;
  max-height: 40px;
  pointer-events: none;
`;

const apps = [
  {
    name: 'commun ios app',
    badgeLink: '/images/app-store-badge.svg',
    link: IOS_STORE_APP_URL,
  },
  {
    name: 'commun android app',
    badgeLink: '/images/google-play-badge.svg',
    link: ANDROID_STORE_APP_URL,
  },
];

export default function MobileAppsLinksBlock() {
  return (
    <Wrapper>
      {apps.map(({ name, badgeLink, link }) => (
        <AppLink key={name} href={link} target="_blank" rel="noopener noreferrer">
          <Badge src={badgeLink} height="40" alt={`${name} badge`} />
          <InvisibleText>{name}</InvisibleText>
        </AppLink>
      ))}
    </Wrapper>
  );
}
