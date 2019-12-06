/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { InvisibleText } from '@commun/ui';

import { getWebsiteHostname } from 'utils/format';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  min-height: min-content;
  flex-grow: 1;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;

  &:not(:last-child) {
    padding-bottom: 10px;
  }

  ${is('isCompact')`
    flex-direction: row;
    border-radius: 8px;
  `}

  ${is('isCompact', 'isInForm')`
     border: none;
  `}
`;

const ThumbnailLink = styled.a.attrs(({ thumbnailUrl }) => ({
  target: '_blank',
  style: {
    backgroundImage: `url("${thumbnailUrl}")`,
  },
}))`
  display: flex;
  height: 260px;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;

  ${is('isCompact')`
    height: auto;
    width: 132px;
  `}
`;

const InfoWrapper = styled.div`
  padding: 16px;

  ${is('isCompact')`
    flex: 1;
  `};
`;

const Info = styled.div`
  position: relative;
  padding-right: 40px;
`;

const TitleLink = styled.a.attrs({
  target: '_blank',
})`
  display: flex;
  margin-bottom: 8px;

  font-weight: 600;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.black};
`;

const LinkStyled = styled.a.attrs({
  target: '_blank',
})`
  display: flex;
  font-size: 15px;

  color: ${({ theme }) => theme.colors.gray};
`;

const CrossButton = styled.button`
  position: absolute;
  display: flex;

  align-items: center;
  justify-content: center;
  top: 5px;
  right: 5px;

  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
`;

const CrossIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 14px;
  height: 14px;
`;

export default function Link(props) {
  const { data, isCompact, isInForm, className, onRemove } = props;
  const { id, attributes, content } = data;
  const { description, url = content, thumbnailUrl, title } = attributes || {};
  const desc = title || description;
  const host = getWebsiteHostname(url);
  const isThumbnailExists = Boolean(thumbnailUrl);

  return (
    <Wrapper isCompact={isCompact} isInForm={isInForm} className={className}>
      {isThumbnailExists && (
        <ThumbnailLink isCompact={isCompact} href={url} thumbnailUrl={thumbnailUrl}>
          <InvisibleText>{desc}</InvisibleText>
        </ThumbnailLink>
      )}
      <InfoWrapper isCompact={isCompact} isThumbnailExists={isThumbnailExists}>
        <Info>
          {desc ? <TitleLink href={url}>{desc}</TitleLink> : null}
          <LinkStyled href={url}>{host}</LinkStyled>
          {onRemove ? (
            <CrossButton onClick={() => onRemove(id)}>
              <CrossIcon />
            </CrossButton>
          ) : null}
        </Info>
      </InfoWrapper>
    </Wrapper>
  );
}

Link.propTypes = {
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

Link.defaultProps = {
  isCompact: false,
  isInForm: false,
  onRemove: undefined,
};
