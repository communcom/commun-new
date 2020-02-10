import React from 'react';
import PropTypes from 'prop-types';
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
  height: ${({ size }) => size || 40}px;
  max-height: ${({ size }) => size || 40}px;
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

export default function MobileAppsLinksBlock({ size, className }) {
  return (
    <Wrapper className={className}>
      {apps.map(({ name, badgeLink, link }) => (
        <AppLink key={name} href={link} target="_blank" rel="noopener noreferrer">
          <Badge src={badgeLink} alt={`${name} badge`} size={size} />
          <InvisibleText>{name}</InvisibleText>
        </AppLink>
      ))}
    </Wrapper>
  );
}

MobileAppsLinksBlock.propTypes = {
  size: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
};

MobileAppsLinksBlock.defaultProps = {
  size: null,
};
