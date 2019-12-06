import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { styles } from '@commun/ui';

import { NodeType } from 'types';
import { proxifyImageUrl } from 'utils/images/proxy';
import { getWebsiteHostname } from 'utils/format';

const Wrapper = styled.a`
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

export default class WebSiteAttachment extends PureComponent {
  static propTypes = {
    attachment: NodeType.isRequired,
  };

  render() {
    const { attachment } = this.props;
    const attrs = attachment.attributes;
    const desc = attrs.title || attrs.description;
    const url = getWebsiteHostname(attachment.content);

    return (
      <Wrapper target="_blank" href={attachment.content}>
        {attrs ? (
          <>
            {attrs.thumbnailUrl ? (
              <Image src={proxifyImageUrl(attrs.thumbnailUrl)} />
            ) : (
              <ImageStub as="div" />
            )}
            <Footer>
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
}
