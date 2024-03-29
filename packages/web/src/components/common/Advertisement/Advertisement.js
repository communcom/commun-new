import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

const ADV_IMAGE_HEIGHT = 213;

const AdvHoverIndicator = styled.div`
  position: absolute;
  width: 100%;
  height: ${ADV_IMAGE_HEIGHT}px;
  transition: background-color 200ms;
`;

const Wrapper = styled.a.attrs({ rel: 'noopener noreferrer noindex', target: '_blank' })`
  position: relative;
  display: block;
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
  background-color: ${({ theme }) => theme.colors.white};

  &:hover ${/* sc-selector */ AdvHoverIndicator}, &:focus ${/* sc-selector */ AdvHoverIndicator} {
    background-color: rgba(0, 0, 0, 0.3);
  }

  ${up.tablet} {
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
  }
`;

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: ${ADV_IMAGE_HEIGHT}px;
  max-width: 100%;
  max-height: ${ADV_IMAGE_HEIGHT}px;
`;

const FooterWrapper = styled.div`
  padding: 16px;
`;

const Title = styled.h4`
  line-height: 20px;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.black};
`;

const LinkToSource = styled.p`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function Advertisement({ imgUrl, imgAltText, advTitle, linkToSource }) {
  const linkName = linkToSource.replace(/http(s)?:\/\/(.+)/, '$2');

  return (
    <Wrapper href={linkToSource}>
      <AdvHoverIndicator />
      <Image src={imgUrl} alt={imgAltText} />
      <FooterWrapper>
        <Title>{advTitle}</Title>
        <LinkToSource>{linkName}</LinkToSource>
      </FooterWrapper>
    </Wrapper>
  );
}

Advertisement.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  imgAltText: PropTypes.string.isRequired,
  advTitle: PropTypes.string.isRequired,
  linkToSource: PropTypes.string.isRequired,
};
