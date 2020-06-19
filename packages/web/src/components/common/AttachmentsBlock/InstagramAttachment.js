import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { NodeType } from 'types';
import { COMMUN_HOST } from 'shared/constants';
import { getWebsiteHostname } from 'utils/format';
import { proxifyImageUrl } from 'utils/images/proxy';
import { isDarkThemeSelector } from 'store/selectors/settings';

import { Footer, ImageStub, Title, Url, Wrapper } from './common';

const InstagramIcon = styled.img`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const InfoWrapper = styled.div`
  display: block;
`;

const WrapperStyled = styled(Wrapper)`
  ${is('isComment')`
    max-width: 300px;
    height: auto;
  `};
`;

const Image = styled.img`
  display: flex;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
`;

const TitleStyled = styled(Title)`
  font-weight: 600;
`;

const FooterStyled = styled(Footer)`
  display: flex;
  align-items: center;
  padding: 16px;

  ${isNot('isDark')`
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-top: none;
  `}
`;

function InstagramAttachment({ attachment, isCard, isComment }) {
  const isDark = useSelector(isDarkThemeSelector);
  const attrs = attachment.attributes;
  const desc = attrs?.author;
  const hostname = getWebsiteHostname(attachment.content);

  const onLinkClick = e => {
    e.stopPropagation();
  };

  const linkProps = {
    as: 'a',
    href: attachment.content,
    target: '_blank',
    onClick: onLinkClick,
  };

  if (hostname === COMMUN_HOST) {
    linkProps.target = '_self';
  }

  function getLinkProps(isFooterLink) {
    if ((isFooterLink && isCard) || (!isFooterLink && !isCard)) {
      return linkProps;
    }

    return {};
  }

  return (
    <WrapperStyled isComment={isComment} {...getLinkProps(false)}>
      {attrs ? (
        <>
          {attrs.thumbnailUrl ? (
            <Image
              src={proxifyImageUrl(attrs.thumbnailUrl)}
              isComment={isComment}
              alt={attrs?.title || ''}
            />
          ) : (
            <ImageStub as="div" />
          )}
          <FooterStyled isDark={isDark} {...getLinkProps(true)}>
            <InstagramIcon src="/images/instagram-icon.svg" alt="" />
            <InfoWrapper>
              <TitleStyled>{desc}</TitleStyled>
              <Url>{hostname}</Url>
            </InfoWrapper>
          </FooterStyled>
        </>
      ) : (
        attachment.content
      )}
    </WrapperStyled>
  );
}

InstagramAttachment.propTypes = {
  attachment: NodeType.isRequired,
  isCard: PropTypes.bool,
  isComment: PropTypes.bool,
};

InstagramAttachment.defaultProps = {
  isCard: false,
  isComment: false,
};

export default memo(InstagramAttachment);
