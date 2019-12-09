import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles } from '@commun/ui';

import { NodeType } from 'types';
import { proxifyImageUrl } from 'utils/images/proxy';
import { getWebsiteHostname } from 'utils/format';

const Wrapper = styled.div`
  display: block;
  border-radius: 10px;
  overflow: hidden;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  border-radius: 10px 10px 0 0;
`;

const ImageStub = styled(Image)`
  height: 140px;
  background: aqua;
`;

const Footer = styled.div`
  display: block;
  padding: 12px 15px 13px;
  border-radius: 0 0 10px 10px;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const Title = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: #000;

  ${styles.breakWord};
`;

const Url = styled.div`
  margin-top: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${styles.breakWord};
`;

function WebSiteAttachment({ attachment, isCard }) {
  const attrs = attachment.attributes;
  const desc = attrs.title || attrs.description;
  const url = getWebsiteHostname(attachment.content);

  const onLinkClick = e => {
    e.stopPropagation();
  };

  const linkProps = {
    as: 'a',
    href: attachment.content,
    target: '_blank',
    onClick: onLinkClick,
  };

  function getLinkProps(isFooterLink) {
    if ((isFooterLink && isCard) || (!isFooterLink && !isCard)) {
      return linkProps;
    }

    return {};
  }

  return (
    <Wrapper {...getLinkProps(false)}>
      {attrs ? (
        <>
          {attrs.thumbnailUrl ? (
            <Image src={proxifyImageUrl(attrs.thumbnailUrl)} />
          ) : (
            <ImageStub as="div" />
          )}
          <Footer {...getLinkProps(true)}>
            <Title>{desc}</Title>
            <Url>{url}</Url>
          </Footer>
        </>
      ) : (
        attachment.content
      )}
    </Wrapper>
  );
}

WebSiteAttachment.propTypes = {
  attachment: NodeType.isRequired,
  isCard: PropTypes.bool,
};

WebSiteAttachment.defaultProps = {
  isCard: false,
};

export default memo(WebSiteAttachment);
