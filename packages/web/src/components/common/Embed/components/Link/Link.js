/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { InvisibleText } from '@commun/ui';
import { getWebsiteHostname } from 'utils/format';

import {
  Wrapper,
  ThumbnailLink,
  InfoWrapper,
  Info,
  TitleLink,
  LinkStyled,
  CrossButton,
  CrossIcon,
} from '../common';

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
