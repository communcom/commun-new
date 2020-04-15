import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { InvisibleText } from '@commun/ui';
import { getWebsiteHostname } from 'utils/format';

import {
  Wrapper,
  InfoWrapper,
  Info,
  TitleLink,
  LinkStyled,
  CrossButton,
  CrossIcon,
} from '../common';

const WrapperStyled = styled(Wrapper)`
  border-radius: 10px;

  ${is('isCompact')`
    flex-direction: column;
    border-radius: 10px;
  `}
`;

const InfoWrapperStyled = styled(InfoWrapper)`
  display: flex;
  align-items: center;
  width: 100%;
`;

const InfoStyled = styled(Info)`
  flex-grow: 1;
`;

const ThumbnailLink = styled.a.attrs({
  target: '_blank',
})`
  display: flex;
  overflow: hidden;
`;

const TitleLinkStyled = styled(TitleLink)`
  margin-bottom: 3px;
`;

const ThumbnailImage = styled.img`
  height: 375px;
  width: 100%;
  max-width: 100%;
  object-fit: cover;
  object-position: center;

  ${is('isCompact')`
    height: auto;
    width: 375px;
  `}
`;

const InstagramIcon = styled.img`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

export default function InstagramPost(props) {
  const { data, isCompact, isInForm, className, onRemove } = props;
  const { id, attributes, content } = data;
  const { author, url = content, thumbnailUrl, title } = attributes || {};
  const desc = author;
  const host = getWebsiteHostname(url);
  const isThumbnailExists = Boolean(thumbnailUrl);

  return (
    <WrapperStyled isCompact={isCompact} isInForm={isInForm} className={className}>
      {isThumbnailExists && (
        <ThumbnailLink isCompact={isCompact} href={url}>
          <ThumbnailImage src={thumbnailUrl} alt={title} />
          <InvisibleText>{desc}</InvisibleText>
        </ThumbnailLink>
      )}
      <InfoWrapperStyled isCompact={isCompact} isThumbnailExists={isThumbnailExists}>
        <InstagramIcon src="/images/instagram-icon.svg" alt="" />
        <InfoStyled>
          {desc ? <TitleLinkStyled href={url}>{desc}</TitleLinkStyled> : null}
          <LinkStyled href={url}>{host}</LinkStyled>
          {onRemove ? (
            <CrossButton onClick={() => onRemove(id)}>
              <CrossIcon />
            </CrossButton>
          ) : null}
        </InfoStyled>
      </InfoWrapperStyled>
    </WrapperStyled>
  );
}

InstagramPost.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      description: PropTypes.string,
      url: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string,
    }),
  }).isRequired,
  isCompact: PropTypes.bool,
  isInForm: PropTypes.bool,
  onRemove: PropTypes.func,
};

InstagramPost.defaultProps = {
  isCompact: false,
  isInForm: false,
  onRemove: undefined,
};