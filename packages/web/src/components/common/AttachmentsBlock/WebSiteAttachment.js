import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { NodeType } from 'types';
import { COMMUN_HOST } from 'shared/constants';
import { getWebsiteHostname } from 'utils/format';
import { proxifyImageUrl } from 'utils/images/proxy';

import { Footer, Image, ImageStub, Title, Url, Wrapper } from './common';

function WebSiteAttachment({ attachment, isCard }) {
  const attrs = attachment.attributes;
  const desc = attrs?.title || attrs?.description;
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
            <Url>{hostname}</Url>
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
